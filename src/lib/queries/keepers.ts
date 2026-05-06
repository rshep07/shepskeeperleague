import { db } from "@/lib/db";

export async function getKeepersBySeason(yearLabel: string) {
  return db.keeper.findMany({
    where: { season: { yearLabel } },
    orderBy: [{ franchise: { currentName: "asc" } }, { playerName: "asc" }],
    include: { franchise: true, season: true },
  });
}

export async function getAllKeeperSeasons() {
  // Returns distinct seasons that have at least one keeper row
  return db.season.findMany({
    where: { keepers: { some: {} } },
    orderBy: { yearLabel: "desc" },
    select: { yearLabel: true, id: true },
  });
}
