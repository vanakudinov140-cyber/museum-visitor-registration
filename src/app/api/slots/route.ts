import { NextResponse } from "next/server";

import { getSlots } from "@/services/booking-service";

export async function GET() {
  const slots = await getSlots();
  return NextResponse.json({ slots });
}
