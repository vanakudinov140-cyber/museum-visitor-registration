import type { VkBotConfig } from "../types";

export function getBotConfig(): VkBotConfig {
  const token = process.env.VK_BOT_TOKEN || "";
  const groupId = process.env.VK_GROUP_ID || "";
  const apiBaseUrl = process.env.BOT_API_BASE_URL || "http://localhost:3000";
  return { token, groupId, apiBaseUrl };
}
