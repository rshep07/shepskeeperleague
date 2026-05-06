import { db } from "@/lib/db";

export async function getAllSeasons() {
  return db.season.findMany({
    orderBy: { yearLabel: "desc" },
  });
}

export async function getSeasonByYear(yearLabel: string) {
  return db.season.findUnique({
    where: { yearLabel },
    include: {
      teamSeasons: {
        orderBy: { rank: "asc" },
        include: { franchise: true },
      },
    },
  });
}
