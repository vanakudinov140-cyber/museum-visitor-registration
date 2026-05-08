import QRCode from "qrcode";
import Link from "next/link";

import { formatDate } from "@/utils/format";

interface Props {
  searchParams: Promise<{
    bookingId?: string;
    date?: string;
    timeSlot?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const bookingId = params.bookingId || "unknown";
  const date = params.date ? formatDate(params.date) : "не указана";
  const time = params.timeSlot || "не указано";

  const qrValue = JSON.stringify({ bookingId, date, time });
  const qrDataUrl = await QRCode.toDataURL(qrValue);

  return (
    <main className="container-padded py-12">
      <div className="card mx-auto max-w-xl p-8 text-center">
        <h1 className="text-3xl font-semibold">Вы успешно записаны!</h1>
        <p className="mt-4 text-slate-600">Дата посещения: {date}</p>
        <p className="text-slate-600">Время: {time}</p>
        <p className="mt-2 text-sm text-slate-500">Номер записи: {bookingId}</p>
        <img src={qrDataUrl} alt="QR код записи" className="mx-auto mt-6 h-44 w-44 rounded-xl border p-2" />
        <Link className="btn-primary mt-8" href="/">
          На главную
        </Link>
      </div>
    </main>
  );
}
