# Shep's Keeper League

Fantasy hockey history site for a private keeper league.

## Stack
- Next.js App Router + TypeScript
- Prisma + Supabase Postgres
- Tailwind CSS
- Vercel deployment

---

## First-time setup

### 1. Clone and install
```bash
git clone <your-repo>
cd skl
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env` and fill in your Supabase connection strings.

Get them from: Supabase project → Settings → Database → Connection string

```bash
cp .env.example .env
# edit .env with your real values
```

### 3. Push the schema to Supabase
```bash
npm run db:push
```

### 4. Seed 2024-25 data
```bash
npm run seed
```

This creates:
- The 2024-25 season
- All 15 franchises
- Keeper rows for all 15 teams (135 total)
- Empty TeamSeason rows (rank/points to be filled in)

### 5. Run locally
```bash
npm run dev
```

---

## After seeding: fill in the blanks

The seed leaves two things empty:
1. **GM names** — edit `scripts/seed-2024-25.ts`, update the `gmName` field for each franchise, re-run `npm run seed`
2. **Standings** — rank, points, champion, in-the-money status for each team. Use Prisma Studio to fill these in manually, or add a standings import script.

```bash
npm run db:studio
```

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Connect it to Vercel
3. Add environment variables in Vercel project settings:
   - `DATABASE_URL`
   - `DIRECT_URL`
4. Deploy

Vercel runs `npm install` which triggers `prisma generate` automatically via `postinstall`.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home |
| `/seasons` | All seasons |
| `/seasons/[year]` | Season standings |
| `/champions` | All champions |
| `/keepers` | Keeper season index |
| `/keepers/[year]` | Keepers by season |
| `/franchises` | All franchises |
| `/franchises/[slug]` | Franchise history + keepers |
| `/owners` | All managers |
| `/owners/[slug]` | Redirects to franchise page (Phase 1) |

---

## Phase 2 (deferred)
- Historical GM transfers / separate owner pages
- Draft history
- Trade history
- Expansion draft history
- Full historical season backfill
- Advanced badge/records engine
