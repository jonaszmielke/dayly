# Dayly

Group availability scheduling. Share link → everyone picks free days → heatmap shows overlap. No accounts.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **PostgreSQL** + Prisma ORM
- **TanStack Query**, Tailwind CSS v4, Base UI, Vaul

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/new` | Create meeting survey |
| `/m/[shortId]` | Summary / heatmap |
| `/m/[shortId]/respond` | Fill in availability |

## Dev

```bash
pnpm install
pnpm dev
```

Needs `DATABASE_URL` in `.env` pointing to a Postgres instance.

```bash
pnpm dlx prisma migrate dev
```
