import { BotApiClient } from "../services/api-client";
import type { BotSessionState } from "../types";

export async function handleBookingFlow(
  state: BotSessionState,
  api: BotApiClient,
  sendMessage: (text: string) => Promise<void>
) {
  if (state.step === "select_date") {
    const slots = await api.getSlots();
    const dates = [...new Set(slots.map((slot) => slot.date.slice(0, 10)))];
    await sendMessage(`Доступные даты: ${dates.join(", ")}`);
    return;
  }

  if (state.step === "confirm" && state.fullName && state.phone && state.selectedSlotId) {
    const booking = await api.registerVisitor({
      fullName: state.fullName,
      phone: state.phone,
      slotId: state.selectedSlotId
    });
    await sendMessage(`Готово! Вы записаны. Номер записи: ${booking.id}`);
  }
}
