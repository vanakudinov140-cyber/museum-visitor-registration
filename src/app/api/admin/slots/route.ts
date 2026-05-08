import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  const slots = await prisma.slot.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }]
  });
  return NextResponse.json({ slots });
}
