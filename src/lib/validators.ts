import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(5, "Введите ФИО полностью"),
  phone: z
    .string()
    .min(10, "Телефон слишком короткий")
    .max(20, "Телефон слишком длинный"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  slotId: z.string().min(1, "Выберите слот"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Нужно согласие на обработку данных" })
  })
});

export const cancelSchema = z.object({
  bookingId: z.string().min(1, "bookingId обязателен"),
  phone: z.string().min(5, "Телефон обязателен")
});
