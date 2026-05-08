import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SLOTS = [
  { date: "2026-06-12", times: ["12:00", "13:00", "14:00"] },
  { date: "2026-06-13", times: ["12:00", "13:00", "14:00"] },
  { date: "2026-06-14", times: ["12:00", "13:00", "14:00"] }
];

async function main() {
  for (const day of SLOTS) {
    for (const time of day.times) {
      await prisma.slot.upsert({
        where: { date_time: { date: new Date(day.date), time } },
        update: {},
        create: {
          date: new Date(day.date),
          time,
          maxVisitors: 20
        }
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
