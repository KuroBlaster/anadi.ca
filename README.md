# Anadi Portfolio + Admin CRM

A personal portfolio built with Next.js App Router, TypeScript, Tailwind CSS, and Motion, now with a built-in admin CRM for Works/blog management.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4
- Motion (`motion/react`)
- `clsx` + `tailwind-merge`
- Prisma + PostgreSQL
- Admin auth with secure HTTP-only session cookies

## Setup

```bash
corepack pnpm install
cp .env.example .env
corepack pnpm run prisma:generate
corepack pnpm dev
```

Open `http://localhost:3000`.

Requires Node.js 20.9 or newer. If you want the plain `pnpm` command, run `corepack enable` once after installing Node.

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm typecheck
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

## Environment Variables

Required in `.env`:

```bash
DATABASE_URL=postgresql://...
SESSION_SECRET=...
ADMIN_EMAIL=...
ADMIN_PASSWORD=...
```

`ADMIN_EMAIL` + `ADMIN_PASSWORD` are used to bootstrap your first admin account.

## Admin CRM

- Login: `/admin/login`
- Dashboard: `/admin`
- Create post: `/admin/posts/new`
- Edit post: `/admin/posts/:id`

V1 scope:
- Manage Works/blog entries only (draft/publish/unpublish/delete)
- Rich markdown editing UI
- Public Works pages read from DB
- Existing hardcoded sample entries are seeded into DB for editing

### First-time DB Setup

```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

Then run:

```bash
pnpm dev
```

## Share Publicly (ngrok)

1. Add your ngrok auth token (one-time):

```bash
pnpm ngrok:auth <YOUR_NGROK_AUTHTOKEN>
```

2. Run app + public tunnel together:

```bash
pnpm share
```

3. Or run tunnel separately (if `pnpm dev` is already running):

```bash
pnpm tunnel
```

When ngrok starts, copy the `https://...ngrok-free.app` URL and share it.

## Project Structure

```text
src/
  app/
    admin/
    about/
    contact/
    music/
    works/
    layout.tsx
    page.tsx
    globals.css
  components/
    cards/
    contact/
    layout/
    ui/
  data/
    site.ts
    works.ts
    mythos.ts
  lib/
    cn.ts
    prisma.ts
    admin-auth.ts
    work-posts.ts
  types/
    content.ts
prisma/
  schema.prisma
  seed.ts
  migrations/
```

## Editing Content

- Public site identity/nav and static showcase cards remain in `src/data/*`.
- CRM-managed Works/blog entries are stored in PostgreSQL and edited via `/admin`.
- Seeding pulls initial entries from `src/data/mythos.ts`.
- SoundCloud in `/music` auto-loads latest 3 tracks from `soundcloudProfileUrl`; `soundcloudTracks` remains fallback.

## Design Notes

- Near-black base with off-white text and restrained accents (gold, blue, crimson).
- Editorial typography with wide spacing and controlled rhythm.
- Subtle motion (fade-ups, staggered reveals, hover glow) with minimal distraction.
- Mobile-first responsive layout across all pages.
