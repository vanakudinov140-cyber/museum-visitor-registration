import type { BotSessionState } from "../types";

export function createInitialState(): BotSessionState {
  return { step: "idle" };
}

export function nextStep(state: BotSessionState, step: BotSessionState["step"]): BotSessionState {
  return { ...state, step };
}
