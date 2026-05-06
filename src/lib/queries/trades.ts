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
  // Get all trades this franchise was involved in, deduplicated
  const sides = await db.tradeSide.findMany({
    where: { franchiseId },
    include: {
      trade: {
        include: {
          season: true,
          sides: {
            include: { franchise: true },
          },
        },
      },
    },
  });

  // Deduplicate by trade ID, sort by season then createdAt
  const seen = new Set<string>();
  const trades = [];
  for (const side of sides) {
    if (!seen.has(side.trade.id)) {
      seen.add(side.trade.id);
      trades.push(side.trade);
    }
  }

  return trades.sort((a, b) => {
    const yearDiff = a.season.yearLabel.localeCompare(b.season.yearLabel);
    if (yearDiff !== 0) return yearDiff;
    return a.createdAt.getTime() - b.createdAt.getTime();
  });
}
