import { NextResponse } from "next/server";

import { registerSchema } from "@/lib/validators";
import { registerVisitor } from "@/services/booking-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.parse(body);

    const booking = await registerVisitor({
      fullName: parsed.fullName,
      phone: parsed.phone,
      email: parsed.email || undefined,
      slotId: parsed.slotId
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка регистрации";
    return NextResponse.json({ success: false, message }, { status: 400 });
  }
}
