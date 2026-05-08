import { NextResponse } from "next/server";

import { cancelSchema } from "@/lib/validators";
import { cancelBooking } from "@/services/booking-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = cancelSchema.parse(body);

    await cancelBooking(parsed.bookingId, parsed.phone);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка отмены";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
