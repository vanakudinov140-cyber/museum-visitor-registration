export interface BotSessionState {
  step: "idle" | "select_date" | "select_time" | "collect_profile" | "confirm";
  selectedDate?: string;
  selectedSlotId?: string;
  fullName?: string;
  phone?: string;
}

export interface VkBotConfig {
  token: string;
  groupId: string;
  apiBaseUrl: string;
}
