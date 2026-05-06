import { db } from "@/lib/db";

export async function getAllChampions() {
  return db.teamSeason.findMany({
    where: { isChampion: true },
    orderBy: { season: { yearLabel: "desc" } },
    include: { franchise: true, season: true },
  });
}
