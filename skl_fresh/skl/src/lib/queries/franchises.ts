import { db } from "@/lib/db";

export async function getAllFranchises() {
  return db.franchise.findMany({
    orderBy: { currentName: "asc" },
  });
}

export async function getFranchiseBySlug(slug: string) {
  return db.franchise.findUnique({
    where: { slug },
    include: {
      teamSeasons: {
        orderBy: { season: { yearLabel: "desc" } },
        include: { season: true },
      },
      keepers: {
        orderBy: [{ season: { yearLabel: "desc" } }, { playerName: "asc" }],
        include: { season: true },
      },
      tradeSides: {
        include: {
          trade: {
            include: {
              season: {
                include: {
                  teamSeasons: {
                    select: { franchiseId: true, teamName: true },
                  },
                },
              },
              sides: {
                include: { franchise: true },
              },
            },
          },
        },
      },
    },
  });
}
