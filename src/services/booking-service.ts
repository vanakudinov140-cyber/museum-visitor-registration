import { BookingStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export async function getSlots() {
  const slots = await prisma.slot.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }]
  });

  return slots.map((slot) => ({
    id: slot.id,
    date: slot.date.toISOString(),
    time: slot.time,
    maxVisitors: slot.maxVisitors,
    bookedVisitors: slot.bookedVisitors,
    available: Math.max(0, slot.maxVisitors - slot.bookedVisitors),
    isFull: slot.bookedVisitors >= slot.maxVisitors
  }));
}

export async function registerVisitor(input: {
  fullName: string;
  phone: string;
  email?: string;
  slotId: string;
}) {
  return prisma.$transaction(async (tx) => {
    const slot = await tx.slot.findUnique({
      where: { id: input.slotId }
    });

    if (!slot) {
      throw new Error("Слот не найден");
    }
    if (slot.bookedVisitors >= slot.maxVisitors) {
      throw new Error("Мест на выбранный слот уже нет");
    }

    const activeBooking = await tx.booking.findFirst({
      where: {
        status: BookingStatus.CONFIRMED,
        user: {
          phone: input.phone
        }
      }
    });

    if (activeBooking) {
      throw new Error("Пользователь уже зарегистрирован");
    }

    const user = await tx.user.upsert({
      where: { phone: input.phone },
      update: { fullName: input.fullName, email: input.email || null },
      create: {
        fullName: input.fullName,
        phone: input.phone,
        email: input.email || null
      }
    });

    const booking = await tx.booking.create({
      data: {
        userId: user.id,
        slotId: slot.id,
        date: slot.date,
        timeSlot: slot.time,
        status: BookingStatus.CONFIRMED
      }
    });

    await tx.slot.update({
      where: { id: slot.id },
      data: { bookedVisitors: { increment: 1 } }
    });

    return {
      id: booking.id,
      date: booking.date.toISOString(),
      timeSlot: booking.timeSlot,
      userName: user.fullName
    };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function cancelBooking(bookingId: string, phone: string) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findFirst({
      where: { id: bookingId, user: { phone }, status: BookingStatus.CONFIRMED }
    });

    if (!booking) {
      throw new Error("Активная запись не найдена");
    }

    await tx.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.CANCELLED, cancelledAt: new Date() }
    });

    await tx.slot.update({
      where: { id: booking.slotId },
      data: { bookedVisitors: { decrement: 1 } }
    });
  });
}
