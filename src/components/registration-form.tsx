"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import type { SlotDTO } from "@/types/booking";
import { formatDate } from "@/utils/format";

interface RegisterFormValues {
  fullName: string;
  phone: string;
  email?: string;
  slotId: string;
  consent: boolean;
}

interface Props {
  slots: SlotDTO[];
}

export function RegistrationForm({ slots }: Props) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormValues>();

  const grouped = useMemo(() => {
    return slots.reduce<Record<string, SlotDTO[]>>((acc, slot) => {
      const key = slot.date.slice(0, 10);
      acc[key] ??= [];
      acc[key].push(slot);
      return acc;
    }, {});
  }, [slots]);

  const [selectedDate, setSelectedDate] = useState<string>(Object.keys(grouped)[0] ?? "");
  const filteredSlots = grouped[selectedDate] ?? [];
  const selectedSlotId = watch("slotId");

  const onSubmit = handleSubmit(async (values) => {
    setIsPending(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Не удалось записаться");
      }

      toast.success("Вы успешно записаны");
      const params = new URLSearchParams({
        bookingId: data.booking.id,
        date: data.booking.date,
        timeSlot: data.booking.timeSlot
      });
      router.push(`/success?${params.toString()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ошибка при отправке формы");
    } finally {
      setIsPending(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="card space-y-6 p-6 md:p-8" id="register">
      <h3 className="text-2xl font-semibold">Запись на посещение</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">ФИО</label>
          <input className="input" {...register("fullName", { required: "Введите ФИО" })} />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Телефон</label>
          <input className="input" {...register("phone", { required: "Введите телефон" })} />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Email (необязательно)</label>
        <input className="input" type="email" {...register("email")} />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Выберите дату</p>
        <div className="flex flex-wrap gap-2">
          {Object.keys(grouped).map((date) => (
            <button
              key={date}
              type="button"
              onClick={() => setSelectedDate(date)}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                selectedDate === date ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300"
              }`}
            >
              {formatDate(date)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Выберите время</p>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {filteredSlots.map((slot) => (
            <label
              key={slot.id}
              className={`flex cursor-pointer items-center justify-between rounded-xl border px-3 py-3 text-sm ${
                slot.isFull ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400" : "border-slate-300"
              }`}
            >
              <span>{slot.time}</span>
              <span className="text-xs">{slot.isFull ? "Нет мест" : `${slot.available} мест`}</span>
              <input
                type="radio"
                value={slot.id}
                disabled={slot.isFull}
                className="hidden"
                {...register("slotId", { required: "Выберите время" })}
              />
            </label>
          ))}
        </div>
        {errors.slotId && <p className="text-sm text-red-600">{errors.slotId.message}</p>}
        {selectedSlotId && <p className="text-sm text-slate-500">Выбран слот: {selectedSlotId}</p>}
      </div>

      <label className="flex items-start gap-2 text-sm text-slate-600">
        <input type="checkbox" className="mt-1" {...register("consent", { required: true })} />
        Я согласен(на) на обработку персональных данных.
      </label>
      {errors.consent && <p className="text-sm text-red-600">Требуется согласие</p>}

      <button className="btn-primary w-full md:w-auto" disabled={isPending} type="submit">
        {isPending ? "Сохраняем..." : "Записаться"}
      </button>
    </form>
  );
}
