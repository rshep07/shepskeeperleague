import { db } from "@/lib/db";

export async function getAllChampions() {
  return db.teamSeason.findMany({
    where: { isChampion: true },
    orderBy: { season: { yearLabel: "desc" } },
    include: {
      franchise: true,
      season: true,
    },
  });
}

export type ChampionWithRoster = Awaited
  ReturnType<typeof getAllChampionsWithRosters>
>[number];

export async function getAllChampionsWithRosters() {
  const champions = await db.teamSeason.findMany({
    where: { isChampion: true },
    orderBy: { season: { yearLabel: "desc" } },
    include: { franchise: true, season: true },
  });

  const withRosters = await Promise.all(
    champions.map(async (c) => {
      if (c.season.platform === "YAHOO") {
        const roster = await db.roster.findMany({
          where: { franchiseId: c.franchiseId, seasonId: c.seasonId },
          orderBy: [{ position: "asc" }, { playerName: "asc" }],
        });
        return { ...c, players: roster };
      } else {
        const keepers = await db.keeper.findMany({
          where: { franchiseId: c.franchiseId, seasonId: c.seasonId },
          orderBy: [{ position: "asc" }, { playerName: "asc" }],
        });
        return { ...c, players: keepers };
      }
    })
  );

  return withRosters;
}
