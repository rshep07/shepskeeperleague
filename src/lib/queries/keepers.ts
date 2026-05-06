import { db } from "@/lib/db";

export async function getKeepersBySeason(yearLabel: string) {
  return db.keeper.findMany({
    where: { season: { yearLabel } },
    orderBy: [{ franchise: { currentName: "asc" } }, { playerName: "asc" }],
    include: { franchise: true, season: true },
  });
}

export async function getAllKeeperSeasons() {
  return db.season.findMany({
    orderBy: { yearLabel: "desc" },
    select: {
      yearLabel: true,
      id: true,
      keepers: { select: { id: true }, take: 1 },
    },
  });
}

export async function getAllSeasonsWithKeepersGrouped() {
  return db.season.findMany({
    orderBy: { yearLabel: "desc" },
    include: {
      keepers: {
        include: { franchise: true },
        orderBy: [{ franchise: { gmName: "asc" } }, { playerName: "asc" }],
      },
    },
  });
}
