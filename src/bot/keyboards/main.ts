export function mainKeyboard() {
  return {
    inline: true,
    buttons: [[{ action: { type: "text", label: "Записаться", payload: "{}" }, color: "primary" }]]
  };
}
