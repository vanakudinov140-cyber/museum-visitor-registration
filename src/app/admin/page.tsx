"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { formatDate } from "@/utils/format";

interface BookingRow {
  id: string;
  status: string;
  date: string;
  timeSlot: string;
  fullName: string;
  phone: string;
  email?: string | null;
}

interface SlotRow {
  id: string;
  date: string;
  time: string;
  maxVisitors: number;
  bookedVisitors: number;
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [slots, setSlots] = useState<SlotRow[]>([]);
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    setLoading(true);
    try {
      const [bookingRes, slotsRes] = await Promise.all([
        fetch(`/api/admin/bookings${dateFilter ? `?date=${dateFilter}` : ""}`),
        fetch("/api/admin/slots")
      ]);
      const bookingData = await bookingRes.json();
      const slotsData = await slotsRes.json();
      setBookings(bookingData.bookings || []);
      setSlots(slotsData.slots || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  async function deleteBooking(id: string) {
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Не удалось удалить запись");
      return;
    }
    toast.success("Запись удалена");
    loadData();
  }

  async function updateSlotLimit(id: string, maxVisitors: number) {
    const input = prompt("Новый лимит мест:", `${maxVisitors}`);
    if (!input) return;
    const res = await fetch(`/api/admin/slots/${id}/limit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maxVisitors: Number(input) })
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Ошибка обновления лимита");
      return;
    }
    toast.success("Лимит обновлен");
    loadData();
  }

  return (
    <main className="container-padded py-10">
      <h1 className="text-3xl font-semibold">Административная панель</h1>
      <p className="mt-2 text-slate-600">Управление регистрациями и слотами мероприятия</p>

      <div className="mt-6 card p-5">
        <label className="mb-2 block text-sm font-medium">Фильтр регистраций по дате</label>
        <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="input max-w-xs" />
      </div>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="card overflow-hidden">
          <header className="border-b border-slate-200 p-4">
            <h2 className="text-xl font-semibold">Регистрации</h2>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-3 py-2">ФИО</th>
                  <th className="px-3 py-2">Телефон</th>
                  <th className="px-3 py-2">Дата</th>
                  <th className="px-3 py-2">Время</th>
                  <th className="px-3 py-2" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-3 py-3" colSpan={5}>
                      Загрузка...
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-slate-100">
                      <td className="px-3 py-3">{booking.fullName}</td>
                      <td className="px-3 py-3">{booking.phone}</td>
                      <td className="px-3 py-3">{formatDate(booking.date)}</td>
                      <td className="px-3 py-3">{booking.timeSlot}</td>
                      <td className="px-3 py-3">
                        <button className="rounded-lg border px-3 py-1 hover:bg-slate-100" onClick={() => deleteBooking(booking.id)}>
                          Удалить
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card overflow-hidden">
          <header className="border-b border-slate-200 p-4">
            <h2 className="text-xl font-semibold">Слоты</h2>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[460px] text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-3 py-2">Дата</th>
                  <th className="px-3 py-2">Время</th>
                  <th className="px-3 py-2">Занято</th>
                  <th className="px-3 py-2">Лимит</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-3 py-3" colSpan={4}>
                      Загрузка...
                    </td>
                  </tr>
                ) : (
                  slots.map((slot) => (
                    <tr key={slot.id} className="border-t border-slate-100">
                      <td className="px-3 py-3">{formatDate(slot.date)}</td>
                      <td className="px-3 py-3">{slot.time}</td>
                      <td className="px-3 py-3">{slot.bookedVisitors}</td>
                      <td className="px-3 py-3">
                        <button className="rounded-lg border px-3 py-1 hover:bg-slate-100" onClick={() => updateSlotLimit(slot.id, slot.maxVisitors)}>
                          {slot.maxVisitors}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
