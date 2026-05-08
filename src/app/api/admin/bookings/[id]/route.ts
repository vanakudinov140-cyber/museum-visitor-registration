import { NextResponse } from "next/server";
import { BookingStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) {
    return NextResponse.json({ success: false, message: "Запись не найдена" }, { status: 404 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.booking.delete({ where: { id } });

    if (booking.status === BookingStatus.CONFIRMED) {
      await tx.slot.update({
        where: { id: booking.slotId },
        data: { bookedVisitors: { decrement: 1 } }
      });
    }
  });

  return NextResponse.json({ success: true });
}
