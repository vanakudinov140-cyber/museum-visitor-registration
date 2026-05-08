import { format } from "date-fns";

export function formatDate(date: Date | string) {
  return format(new Date(date), "dd.MM.yyyy");
}

export function slotLabel(date: Date | string, time: string) {
  return `${formatDate(date)} ${time}`;
}
