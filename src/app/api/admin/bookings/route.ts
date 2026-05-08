import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const bookings = await prisma.booking.findMany({
    where: date
      ? {
          date: {
            gte: new Date(`${date}T00:00:00.000Z`),
            lt: new Date(`${date}T23:59:59.999Z`)
          }
        }
      : undefined,
    include: {
      user: true,
      slot: true
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({
    bookings: bookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      date: booking.date.toISOString(),
      timeSlot: booking.timeSlot,
      fullName: booking.user.fullName,
      phone: booking.user.phone,
      email: booking.user.email,
      slotId: booking.slotId
    }))
  });
}
