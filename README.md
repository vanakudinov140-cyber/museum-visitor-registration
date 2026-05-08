# Museum Visitor Registration

Production-ready проект системы регистрации посетителей музея на Next.js 15.

## Технологии

- Next.js 15 + App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- API Routes

## Реализовано

- Лендинг мероприятия
- Форма регистрации с выбором даты и времени
- Автоматическая блокировка заполненных слотов
- Страница успешной регистрации + QR-код записи
- API: register, slots, cancel, admin/bookings
- Админ-панель (просмотр записей, фильтр по дате, изменение лимитов, удаление записи)
- Защита от повторной записи (по телефону)
- Архитектурная заготовка VK-бота (`src/bot`)

## Быстрый старт

1. Установите Node.js 20+ и npm.
2. Скопируйте `.env.example` в `.env`.
3. Установите зависимости:
   ```bash
   npm install
   ```
4. Создайте миграции и prisma client:
   ```bash
   npm run prisma:migrate
   npm run prisma:generate
   npm run prisma:seed
   ```
5. Запустите проект:
   ```bash
   npm run dev
   ```

## API

- `POST /api/register` - регистрация пользователя
- `GET /api/slots` - доступные слоты
- `POST /api/cancel` - отмена записи
- `GET /api/admin/bookings` - список регистраций
- `GET /api/admin/slots` - список слотов
- `PATCH /api/admin/slots/:id/limit` - обновление лимита
- `DELETE /api/admin/bookings/:id` - удаление регистрации

## Структура

`src/` содержит:

- `app/`
- `components/`
- `lib/`
- `services/`
- `api/`
- `bot/`
- `types/`
- `utils/`

## Деплой на Amvera (24/7)

Проект подготовлен для деплоя через Docker.

### 1) Что уже добавлено в проект

- `Dockerfile` (production multi-stage build)
- `docker-entrypoint.sh` (автозапуск `prisma migrate deploy` + старт сервера)
- `.dockerignore`
- `next.config.ts` с `output: "standalone"`

### 2) Переменные окружения в Amvera

Добавьте в переменные приложения:

- `DATABASE_URL` - строка подключения PostgreSQL
- `NODE_ENV=production`
- `PORT=3000` (если Amvera сама задает порт, можно не указывать)

### 3) Что выбрать в Amvera

- Source: ваш Git-репозиторий
- Тип деплоя: Dockerfile
- Build command: не нужен (используется Dockerfile)
- Start command: не нужен (используется `ENTRYPOINT`)

### 4) После деплоя

- Откройте домен приложения от Amvera
- Проверьте:
  - `/` (лендинг)
  - `/admin` (админка)

Рекомендуется сразу добавить авторизацию на админ-панель перед публичным запуском.
