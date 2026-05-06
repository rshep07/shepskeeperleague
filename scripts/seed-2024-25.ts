/**
 * Seed script: 2024-25 season
 *
 * Run: npm run seed
 *
 * What this does:
 *   1. Creates the 2024-25 Season row
 *   2. Creates all 15 Franchise rows
 *   3. Creates TeamSeason rows (rank/points left null — fill in from your standings CSV)
 *   4. Creates all 135 Keeper rows from the verified keeper truth set
 *
 * Safe to re-run: uses upsert throughout.
 *
 * After running:
 *   - Update gmName for each franchise (currently "TBD")
 *   - Add rank, points, isChampion, isInTheMoney to each TeamSeason
 *     using the Fantrax standings CSV
 */

import { PrismaClient, Platform } from "@prisma/client";

const db = new PrismaClient();

// ---------------------------------------------------------------------------
// 2024-25 keeper truth set
// ---------------------------------------------------------------------------
const KEEPERS: Record<string, string[]> = {
  "auston-massachusetts": [
    "Drake Batherson", "Brandon Hagel", "Patrick Kane", "Jonathan Marchessault",
    "Auston Matthews", "Elias Pettersson", "Jason Robertson", "Morgan Rielly",
    "Jacob Markstrom",
  ],
  "beef-dip": [
    "Dylan Cozens", "Kevin Fiala", "Jack Hughes", "Clayton Keller",
    "Brad Marchand", "Quinn Hughes", "Cale Makar", "Jordan Binnington",
    "Jeremy Swayman",
  ],
  "bones": [
    "Quinton Byfield", "Kyle Connor", "Jonathan Drouin", "Roope Hintz",
    "Adrian Kempe", "Chris Kreider", "Robert Thomas", "Brandon Montour",
    "Andrei Vasilevskiy",
  ],
  "beniteemu-muselanne": [
    "Mathew Barzal", "Nico Hischier", "Zach Hyman", "Will Smith",
    "Steven Stamkos", "Tim Stutzle", "Jakob Chychrun", "Pavel Mintyukov",
    "Linus Ullmark",
  ],
  "channel-4-news-team": [
    "Matty Beniers", "Jack Eichel", "Filip Forsberg", "Alexis Lafreniere",
    "J.T. Miller", "Artemi Panarin", "Alex Tuch", "Lukas Dostal",
    "Yaroslav Askarov",
  ],
  "ghxsts": [
    "Kirill Kaprizov", "Nikita Kucherov", "Martin Necas", "Vincent Trocheck",
    "Noah Dobson", "Adam Fox", "Shayne Gostisbehere", "Mike Matheson",
    "Igor Shesterkin",
  ],
  "hope-on-the-hutson": [
    "Sebastian Aho", "David Pastrnak", "JJ Peterka", "Nick Suzuki",
    "Miro Heiskanen", "Lane Hutson", "Matt Boldy", "Juuse Saros",
    "Stuart Skinner",
  ],
  "jeunes-loups": [
    "Zach Benson", "Leo Carlsson", "Wyatt Johnston", "Lucas Raymond",
    "Juraj Slafkovsky", "Matthew Tkachuk", "Brandt Clarke", "Simon Nemec",
    "Jake Oettinger",
  ],
  "jmfj": [
    "Brock Boeser", "Adam Fantilli", "Jake Guentzel", "Shane Pinto",
    "Brayden Point", "Brady Tkachuk", "Mats Zuccarello", "Thatcher Demko",
    "Pyotr Kochetkov",
  ],
  "king-slayers": [
    "Sidney Crosby", "Alex DeBrincat", "Leon Draisaitl", "Cutter Gauthier",
    "William Nylander", "Sam Reinhart", "Carter Verhaeghe", "Connor Hellebuyck",
    "Connor Ingram",
  ],
  "nick-not-daniel": [
    "Connor Bedard", "Travis Konecny", "Dylan Larkin", "Matvei Michkov",
    "Gustav Nyquist", "Mika Zibanejad", "Dougie Hamilton", "Sergei Bobrovsky",
    "Samuel Ersson",
  ],
  "nick-not-daniel-carriere": [
    "Connor McDavid", "Jake Neighbours", "Ryan Nugent-Hopkins", "Mark Scheifele",
    "Dylan Strome", "Gabriel Vilardi", "Evan Bouchard", "Josh Morrissey",
    "Ilya Sorokin",
  ],
  "schmidts-creek": [
    "Jesper Bratt", "Logan Cooley", "Dylan Guenther", "Mitch Marner",
    "Mikko Rantanen", "Andrei Svechnikov", "Brock Faber", "Ukko-Pekka Luukkonen",
    "Joseph Woll",
  ],
  "the-blouses": [
    "Aleksander Barkov", "Nikolaj Ehlers", "Seth Jarvis", "Nathan MacKinnon",
    "Evgeni Malkin", "Victor Hedman", "Roman Josi", "Alexandar Georgiev",
    "Dustin Wolf",
  ],
  "the-degenerates": [
    "Pavel Buchnevich", "Cole Caufield", "Jordan Kyrou", "Logan Stankoven",
    "Tage Thompson", "Trevor Zegras", "Shea Theodore", "Luke Hughes",
    "Adin Hill",
  ],
};

// ---------------------------------------------------------------------------
// Franchise display names — update gmName once you have the real names
// ---------------------------------------------------------------------------
const FRANCHISES: { slug: string; currentName: string; gmName: string }[] = [
  { slug: "auston-massachusetts",    currentName: "Auston Massachusetts",    gmName: "TBD" },
  { slug: "beef-dip",                currentName: "BEEF DIP",                gmName: "TBD" },
  { slug: "bones",                   currentName: "Bones",                   gmName: "TBD" },
  { slug: "beniteemu-muselanne",     currentName: "BENITEEMU MUSELANNE",     gmName: "TBD" },
  { slug: "channel-4-news-team",     currentName: "Channel 4 News Team",     gmName: "TBD" },
  { slug: "ghxsts",                  currentName: "Ghxsts",                  gmName: "TBD" },
  { slug: "hope-on-the-hutson",      currentName: "Hope on the Hutson",      gmName: "TBD" },
  { slug: "jeunes-loups",            currentName: "Jeunes Loups",            gmName: "TBD" },
  { slug: "jmfj",                    currentName: "JMFJ",                    gmName: "TBD" },
  { slug: "king-slayers",            currentName: "King Slayers",            gmName: "TBD" },
  { slug: "nick-not-daniel",         currentName: 'Nick, Not! Daniel"',      gmName: "TBD" },
  { slug: "nick-not-daniel-carriere",currentName: 'Nick Not Daniel" Carriere"', gmName: "TBD" },
  { slug: "schmidts-creek",          currentName: "Schmidt's Creek",         gmName: "TBD" },
  { slug: "the-blouses",             currentName: "The Blouses",             gmName: "TBD" },
  { slug: "the-degenerates",         currentName: "The Degenerates",         gmName: "TBD" },
];

// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding 2024-25 season...\n");

  // 1. Season
  const season = await db.season.upsert({
    where: { yearLabel: "2024-25" },
    update: {},
    create: {
      yearLabel:   "2024-25",
      platform:    Platform.FANTRAX,
      teamCount:   15,
      keeperLimit: 9,
      payoutCount: 4,
      isFinalized: true,
    },
  });
  console.log(`✓ Season: ${season.yearLabel}`);

  // 2. Franchises
  const franchiseMap: Record<string, string> = {}; // slug → id

  for (const f of FRANCHISES) {
    const record = await db.franchise.upsert({
      where:  { slug: f.slug },
      update: { currentName: f.currentName },
      create: { slug: f.slug, currentName: f.currentName, gmName: f.gmName },
    });
    franchiseMap[f.slug] = record.id;
    console.log(`  franchise: ${f.currentName}`);
  }

  // 3. TeamSeasons — real 2024-25 final standings from Fantrax CSV
  console.log("\nCreating TeamSeason rows with real 2024-25 standings...");

  const standings: Record<string, { rank: number; points: number; isChampion: boolean; isInTheMoney: boolean }> = {
    "ghxsts":                    { rank: 1,  points: 1249, isChampion: true,  isInTheMoney: true  },
    "hope-on-the-hutson":        { rank: 2,  points: 1223, isChampion: false, isInTheMoney: true  },
    "nick-not-daniel-carriere":  { rank: 3,  points: 1181, isChampion: false, isInTheMoney: true  },
    "the-degenerates":           { rank: 4,  points: 1180, isChampion: false, isInTheMoney: true  },
    "the-blouses":               { rank: 5,  points: 1164, isChampion: false, isInTheMoney: false },
    "bones":                     { rank: 6,  points: 1156, isChampion: false, isInTheMoney: false },
    "auston-massachusetts":      { rank: 7,  points: 1118, isChampion: false, isInTheMoney: false },
    "schmidts-creek":            { rank: 8,  points: 1115, isChampion: false, isInTheMoney: false },
    "jeunes-loups":              { rank: 9,  points: 1047, isChampion: false, isInTheMoney: false },
    "nick-not-daniel":           { rank: 10, points: 1032, isChampion: false, isInTheMoney: false },
    "king-slayers":              { rank: 11, points: 970,  isChampion: false, isInTheMoney: false },
    "jmfj":                      { rank: 12, points: 951,  isChampion: false, isInTheMoney: false },
    "channel-4-news-team":       { rank: 13, points: 945,  isChampion: false, isInTheMoney: false },
    "beniteemu-muselanne":       { rank: 14, points: 872,  isChampion: false, isInTheMoney: false },
    "beef-dip":                  { rank: 15, points: 826,  isChampion: false, isInTheMoney: false },
  };

  for (const f of FRANCHISES) {
    const s = standings[f.slug];
    await db.teamSeason.upsert({
      where: {
        franchiseId_seasonId: {
          franchiseId: franchiseMap[f.slug],
          seasonId:    season.id,
        },
      },
      update: {
        rank:         s.rank,
        points:       s.points,
        isChampion:   s.isChampion,
        isInTheMoney: s.isInTheMoney,
      },
      create: {
        franchiseId:  franchiseMap[f.slug],
        seasonId:     season.id,
        teamName:     f.currentName,
        rank:         s.rank,
        points:       s.points,
        isChampion:   s.isChampion,
        isInTheMoney: s.isInTheMoney,
      },
    });
  }
  console.log("✓ TeamSeason rows created with real standings");

  // 4. Keepers
  console.log("\nSeeding keepers...");
  let keeperCount = 0;

  for (const [slug, players] of Object.entries(KEEPERS)) {
    const franchiseId = franchiseMap[slug];
    if (!franchiseId) {
      console.warn(`  ⚠ No franchise found for slug: ${slug}`);
      continue;
    }
    for (const playerName of players) {
      await db.keeper.upsert({
        where: {
          franchiseId_seasonId_playerName: { franchiseId, seasonId: season.id, playerName },
        },
        update: {},
        create: { franchiseId, seasonId: season.id, playerName },
      });
      keeperCount++;
    }
    console.log(`  ${slug}: ${players.length} keepers`);
  }

  console.log(`\n✓ Done. ${keeperCount} keepers seeded.`);
  console.log("\nNext steps:");
  console.log("  - Update gmName for each franchise (search 'TBD' in this file) and re-run seed");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
