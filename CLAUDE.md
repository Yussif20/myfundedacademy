# Nibras · نبراس — Project Reference

A **bilingual course platform for any instructor**. DRM-protected video lessons, one-time + subscription purchases, certificates, quizzes, English + Arabic with RTL. The name means "lamp" in Arabic.

> **Status: MVP, portfolio product.** Runs on $0/mo free-tier infra (except VdoCipher after its trial). Scope is intentionally trimmed (no Stripe Connect, no instructor self-signup, no queues, no discussions). See `docs/PROJECT_STATUS.md` for what's built and the roadmap.

## Project Structure

```
nibras/
├── frontend/          # Next.js 16 (React 19) client application
├── server/            # Express 5 + TypeScript REST API
├── docs/              # PROJECT_STATUS.md — status and roadmap
└── CLAUDE.md          # This file
```

## Tech Stack

| Layer           | Technology                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Frontend**    | Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4, Redux Toolkit (RTK Query), shadcn/ui (new-york), next-intl |
| **Backend**     | Express 5, TypeScript 5.9, Prisma 6.19 ORM                                                                       |
| **Database**    | PostgreSQL — **Neon free tier** for MVP                                                                          |
| **Storage**     | **Cloudflare R2 free tier** — S3-compatible API, zero egress fees                                                |
| **Video DRM**   | **VdoCipher free trial** for MVP — Widevine + FairPlay + PlayReady, dynamic watermarking                         |
| **Payments**    | **Stripe Checkout + Stripe Billing (test mode)**. Connect deferred to post-signoff.                              |
| **Email**       | **Resend free tier** (3000/mo)                                                                                   |
| **Auth**        | JWT (access + refresh), bcrypt, OTP, magic links                                                                 |
| **i18n**        | next-intl (frontend), i18next (backend) — `en`, `ar`                                                             |
| **Cache/Queue** | _Skipped for MVP_ (no Redis, no BullMQ; email/certs run inline). Added post-signoff.                             |

## Getting Started

### Prerequisites

- Node.js 20+
- A Postgres connection string (Neon free tier is enough)

### Setup

```bash
# Server
cd server
npm install
cp .env.example .env       # fill in DATABASE_URL + secrets
npx prisma generate
npm run dev                # http://localhost:5000

# Frontend (optional NEXT_PUBLIC_* vars in .env.local — see README)
cd frontend
npm install
npm run dev                # http://localhost:3000
```

## API Base URL

- **Backend API**: `http://localhost:5000/api/v1`
- **Health check**: `http://localhost:5000/health`
- **Frontend dev**: `http://localhost:3000`

## Build History (MVP batches)

| Batch | MVP scope                                                                         |
| ----: | --------------------------------------------------------------------------------- |
|  0 ✅ | Scaffolding (shipped)                                                             |
|  1 ✅ | `auth` (signup/login/email-verify/pwd-reset) + roles + admin seed                 |
|  2 ✅ | Admin-managed instructors + course CRUD (admin-only authoring) + VdoCipher upload |
|  3 ✅ | Categories + featured courses + admin publishing                                  |
|  4 ✅ | Catalog + Stripe Checkout (one-time) + Stripe Billing (subscription) + webhooks   |
|  5 ✅ | Course player with DRM OTP + watermark + progress tracking                        |
|  6 ✅ | Quizzes + auto-generated certificates + public verification page                  |
|  7 ✅ | Reviews/ratings                                                                   |
|  8 ✅ | Arabic translations + RTL polish                                                  |
|  9 ✅ | Demo deploy (Netlify + Render + UptimeRobot)                                      |

**Not built yet:** Stripe Connect (revenue splits), instructor self-signup application flow, BullMQ + Redis queues, discussions/Q&A, wishlist, coupons.

## User Roles

- `STUDENT` — Default. Buys courses, takes them.
- `INSTRUCTOR` — Authors courses. **Admin-seeded for MVP** (no public application flow). Payouts handled manually until Stripe Connect lands.
- `ADMIN` — Approves courses, moderates content, creates instructor accounts.

## Subscription Tiers

| Tier       | Price   | Access                                                              |
| ---------- | ------- | ------------------------------------------------------------------- |
| Free       | $0      | Free preview lessons, browse catalog, 1 quiz attempt per course     |
| Starter    | $29/mo  | Selected catalog (~30%), no certificates                            |
| Pro        | $79/mo  | Full catalog + certificates + downloadable resources + priority Q&A |
| Pro Annual | $790/yr | Pro features, ~2 months free                                        |

One-time course purchases work at any tier and grant **lifetime access** that bypasses subscription state.

## Brand

- Name: **Nibras · نبراس** (always bilingual in the logo; "Nibras" in English copy, "نبراس" in Arabic copy)
- Logo: lamp mark (gold flame over a teal bowl) + wordmark — `frontend/public/logo.svg` (light), `logo-dark.svg` (dark), `logo-mark.svg`, `favicon.svg`. In the app the lockup is the `Wordmark` component (typographic, theme-aware).
- Look: **"Paper & Ink"** — warm ivory paper, ink text, one teal accent (`#1f5c4f` light / `#5fb39c` dark), gold details (`#b08a3e`). See `frontend/DESIGN.md`.
- Default theme: **light** (dark mode matches)
- Display: **Newsreader** / **Noto Naskh Arabic** • Body: **Inter** / **IBM Plex Sans Arabic**
- No animation library: CSS transitions + `Reveal`; `npm run lint:tokens` and `npm run lint:rtl` guard colours and RTL.

## Key Patterns

- **Frontend path alias**: `@/*` → `./src/*`
- **Server path alias**: `@/*` → `./src/*`, `@/db` → `./src/lib/db/db`
- **API routes**: All prefixed with `/api/v1`
- **Soft deletes**: `isDeleted` flag instead of hard deletes
- **Validation**: Zod on both sides
- **Server module pattern**: `*.controller.ts` / `*.interface.ts` / `*.route.ts` / `*.service.ts` / `*.validation.ts`
- **State management**: Redux Toolkit + RTK Query + redux-persist (auth state)
- **Bilingual fields**: `field` + `fieldArabic` pairs on user-facing models

## Useful Commands

```bash
# Server
npm run dev                # Dev server with hot reload
npm run build              # Compile TypeScript to dist/
npm run typecheck          # tsc --noEmit
npm run prisma:gen         # Generate Prisma client
npm run prisma:push        # Push schema to DB (dev only)
npm run gn-route <name>    # Scaffold a new module

# Frontend
npm run dev                # Next.js dev server
npm run build              # Production build
npm run typecheck
npm run lint
```

## Important Paths

- Server entry: `server/src/server.ts`
- Express app config: `server/src/app.ts`
- Route registry: `server/src/routes.ts`
- Env validation: `server/src/env.ts`
- Prisma singleton: `server/src/lib/db/db.ts`
- Frontend store: `frontend/src/redux/store/index.ts`
- RTK base API: `frontend/src/redux/api/baseApi.ts`
- App config (backend URL): `frontend/src/config.ts`
- Brand tokens: `frontend/src/app/globals.css`
- Home page: `frontend/src/components/landing/home.tsx`
- Illustrative marketing content (invented testimonials, topic marquee): `frontend/src/lib/showcase.ts`

## DRM Honest Caveat

Tier A DRM (Widevine + FairPlay + PlayReady + dynamic watermarking) stops:

- Browser download tools and extensions
- Casual screen recording (HDCP blocks it on protected paths)
- Link sharing (each playback is a user-bound short-lived OTP)

It **does not** stop a determined user with a second phone camera. The defense for that is the dynamic watermark — every playback burns viewer email + IP into the video, so any leak traces back to a specific account.

## Hosting (MVP — all $0/mo)

- **Frontend** → Netlify free tier (planned demo domain: `nibras.yousefayman.com`)
- **Backend** → Render free tier (`server/render.yaml`), kept warm by a UptimeRobot HTTP pinger
- **DB** → Neon free tier (3 GB)
- **Storage** → Cloudflare R2 free tier (10 GB, zero egress fees)
- **Video** → VdoCipher free trial CDN
- **Email** → Resend free tier
- **DNS / WAF** → Cloudflare free tier

See `server/.env.example` for the server's environment variables and `README.md` for the frontend's. Never commit real secrets: `.env.example` holds placeholders only.

## Identifiers

- Refresh-token cookie: `nb_rt` (server `utils/cookies.ts`); persisted auth key: `nibras-auth` (frontend `redux/store`).
- Certificate codes: `NB-XXXXXXXX`. Older `MFA-` codes still verify because lookup is by exact code.
