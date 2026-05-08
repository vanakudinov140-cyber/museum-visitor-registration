import { mainKeyboard } from "../keyboards/main";

export async function handleStart(sendMessage: (text: string, keyboard?: unknown) => Promise<void>) {
  await sendMessage(
    "Добро пожаловать! Я помогу записаться на открытие музея. Нажмите кнопку ниже, чтобы начать.",
    mainKeyboard()
  );
}
