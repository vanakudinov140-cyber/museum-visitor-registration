import Link from "next/link";

import { RegistrationForm } from "@/components/registration-form";
import { EVENT_INFO } from "@/lib/constants";
import { getSlots } from "@/services/booking-service";

export default async function HomePage() {
  const slots = await getSlots();

  return (
    <main>
      <section className="container-padded py-10 md:py-16">
        <div className="card overflow-hidden p-8 md:p-12">
          <p className="text-sm uppercase tracking-wider text-slate-500">{EVENT_INFO.museumName}</p>
          <h1 className="mt-3 text-4xl font-semibold md:text-6xl">{EVENT_INFO.title}</h1>
          <p className="mt-4 text-lg text-slate-600">{EVENT_INFO.dates}</p>
          <a className="btn-primary mt-8" href="#register">
            Записаться
          </a>
        </div>
      </section>

      <section className="container-padded pb-8">
        <div className="grid gap-6 md:grid-cols-2">
          <article className="card p-6">
            <h2 className="text-2xl font-semibold">О мероприятии</h2>
            <p className="mt-3 text-slate-600">{EVENT_INFO.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Адрес: {EVENT_INFO.address}</li>
              <li>Время работы: {EVENT_INFO.openHours}</li>
              <li>Формат: экскурсия и презентация экспозиций</li>
            </ul>
          </article>
          <article className="card flex min-h-56 items-center justify-center bg-gradient-to-br from-slate-800 to-slate-600 p-6 text-white">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-200">Афиша открытия</p>
              <p className="mt-2 text-2xl font-semibold">{EVENT_INFO.dates}</p>
              <p className="mt-2 text-slate-100">{EVENT_INFO.address}</p>
            </div>
          </article>
        </div>
      </section>

      <section className="container-padded pb-12">
        <RegistrationForm slots={slots} />
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="container-padded flex flex-col gap-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>{EVENT_INFO.museumName}</p>
          <p>{EVENT_INFO.address}</p>
          <Link className="underline decoration-dotted underline-offset-4" href="https://vk.com" target="_blank">
            VK сообщества
          </Link>
        </div>
      </footer>
    </main>
  );
}
