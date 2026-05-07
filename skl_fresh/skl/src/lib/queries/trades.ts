import { db } from "@/lib/db";

export async function getSeasonsWithTrades() {
  return db.season.findMany({
    where: { trades: { some: {} } },
    include: { _count: { select: { trades: true } } },
    orderBy: { yearLabel: "desc" },
  });
}

export async function getTradesBySeason(yearLabel: string) {
  const season = await db.season.findUnique({
    where: { yearLabel },
    include: {
      teamSeasons: { include: { franchise: true } },
    },
  });
  if (!season) return null;

  const trades = await db.trade.findMany({
    where: { seasonId: season.id },
    include: {
      sides: { include: { franchise: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const teamNames: Record<string, string> = {};
  for (const ts of season.teamSeasons) {
    teamNames[ts.franchiseId] = ts.teamName;
  }

  return { season, trades, teamNames };
}

export async function getAllSeasonsWithTradeDetails() {
  return db.season.findMany({
    where: { trades: { some: {} } },
    orderBy: { yearLabel: "desc" },
    include: {
      trades: {
        orderBy: { createdAt: "asc" },
        include: {
          sides: { include: { franchise: true } },
        },
      },
      teamSeasons: { select: { franchiseId: true, teamName: true } },
    },
  });
}
