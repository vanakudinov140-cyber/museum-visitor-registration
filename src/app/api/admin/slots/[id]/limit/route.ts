import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const maxVisitors = Number(body.maxVisitors);

  if (!Number.isInteger(maxVisitors) || maxVisitors <= 0) {
    return NextResponse.json({ success: false, message: "Некорректный лимит" }, { status: 400 });
  }

  const slot = await prisma.slot.findUnique({ where: { id } });
  if (!slot) {
    return NextResponse.json({ success: false, message: "Слот не найден" }, { status: 404 });
  }
  if (maxVisitors < slot.bookedVisitors) {
    return NextResponse.json(
      { success: false, message: "Лимит меньше текущего числа записанных посетителей" },
      { status: 400 }
    );
  }

  const updated = await prisma.slot.update({
    where: { id },
    data: { maxVisitors }
  });

  return NextResponse.json({ success: true, slot: updated });
}
