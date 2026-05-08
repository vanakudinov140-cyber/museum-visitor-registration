import type { SlotDTO } from "@/types/booking";

export class BotApiClient {
  constructor(private readonly baseUrl: string) {}

  async getSlots() {
    const response = await fetch(`${this.baseUrl}/api/slots`);
    if (!response.ok) throw new Error("Не удалось получить слоты");
    const data = await response.json();
    return data.slots as SlotDTO[];
  }

  async registerVisitor(payload: {
    fullName: string;
    phone: string;
    email?: string;
    slotId: string;
  }) {
    const response = await fetch(`${this.baseUrl}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, consent: true })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Ошибка регистрации");
    return data.booking;
  }
}
