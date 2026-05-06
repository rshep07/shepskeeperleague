import { db } from "@/lib/db";

export async function getKeepersBySeason(yearLabel: string) {
  return db.keeper.findMany({
    where: { season: { yearLabel } },
    orderBy: [{ franchise: { currentName: "asc" } }, { playerName: "asc" }],
    include: { franchise: true, season: true },
  });
}

export async function getAllKeeperSeasons() {
  // Returns ALL seasons so we can show placeholder for ones without keepers
  return db.season.findMany({
    orderBy: { yearLabel: "desc" },
    select: {
      yearLabel: true,
      id: true,
      keepers: { select: { id: true }, take: 1 },
    },
  });
}
