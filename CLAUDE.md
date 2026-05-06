# My Funded Academy (MFA) — Project Reference

A **multi-instructor trading courses marketplace**. DRM-protected video lessons, one-time + subscription purchases, instructor payouts via Stripe Connect, certificates, quizzes, English + Arabic with RTL.

Sister project to [Funded For You](https://github.com/Yussif20/fundedforyou) — runs on its own infrastructure (separate repo, DB, Stripe account, host).

## Project Structure

```
myfundedacademy/
├── frontend/          # Next.js 16 (React 19) client application
├── server/            # Express 5 + TypeScript REST API
└── CLAUDE.md          # This file
```

## Tech Stack

| Layer           | Technology                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Frontend**    | Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4, Redux Toolkit (RTK Query), shadcn/ui (new-york), next-intl |
| **Backend**     | Express 5, TypeScript 5.9, Prisma 6.19 ORM                                                                       |
| **Database**    | PostgreSQL (Neon for dev → DO Managed PG in prod)                                                                |
| **Cache/Queue** | Redis (Upstash) + BullMQ (queues land in Batch 4)                                                                |
| **Storage**     | DigitalOcean Spaces (`mfa-prod` bucket — separate from FFY)                                                      |
| **Video DRM**   | **VdoCipher** — Widevine + FairPlay + PlayReady, dynamic watermarking                                            |
| **Payments**    | Stripe Checkout + Stripe Billing + Stripe Connect Express                                                        |
| **Email**       | Resend                                                                                                           |
| **Auth**        | JWT (access + refresh), bcrypt, OTP, magic links                                                                 |
| **i18n**        | next-intl (frontend), i18next (backend) — `en`, `ar`                                                             |

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

# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev                # http://localhost:3000
```

## API Base URL

- **Backend API**: `http://localhost:5000/api/v1`
- **Health check**: `http://localhost:5000/health`
- **Frontend dev**: `http://localhost:3000`

## Domain Modules (planned, by batch)

| Batch | Modules                                                                             |
| ----: | ----------------------------------------------------------------------------------- |
|  0 ✅ | Scaffolding (this batch)                                                            |
|     1 | `auth`, `users`, `instructor-applications`                                          |
|     2 | `courses`, `sections`, `lessons`, `vdocipher` (instructor authoring)                |
|     3 | `admin-moderation`, `categories`                                                    |
|     4 | `catalog`, `orders` (Stripe Checkout), `subscriptions` (Stripe Billing), `webhooks` |
|     5 | `enrollments`, `progress`, `player` (DRM OTP + watermark)                           |
|     6 | `quizzes`, `certificates`                                                           |
|     7 | `reviews`, `discussions`, `qna`                                                     |
|     8 | `payouts` (Stripe Connect Express), `instructor-analytics`                          |
|     9 | Arabic translation pass + RTL polish                                                |
|    10 | SEO, sitemaps, structured data, production deploy                                   |

## User Roles

- `STUDENT` — Default. Buys courses, takes them.
- `INSTRUCTOR` — Authors courses, gets payouts. **Invite-only at launch.**
- `ADMIN` — Approves courses & instructors, moderates content.

## Subscription Tiers

| Tier       | Price   | Access                                                              |
| ---------- | ------- | ------------------------------------------------------------------- |
| Free       | $0      | Free preview lessons, browse catalog, 1 quiz attempt per course     |
| Starter    | $29/mo  | Selected catalog (~30%), no certificates                            |
| Pro        | $79/mo  | Full catalog + certificates + downloadable resources + priority Q&A |
| Pro Annual | $790/yr | Pro features, ~2 months free                                        |

One-time course purchases work at any tier and grant **lifetime access** that bypasses subscription state.

## Brand

- Primary: deep teal `#0F766E` — `oklch(0.51 0.09 180)` light / `oklch(0.65 0.11 180)` dark
- Accent: warm amber `#F59E0B` — `oklch(0.78 0.16 70)`
- Default theme: **dark**
- Display font: **Sora** • Body: **Inter** • Arabic: **IBM Plex Sans Arabic**

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

## DRM Honest Caveat

Tier A DRM (Widevine + FairPlay + PlayReady + dynamic watermarking) stops:

- Browser download tools and extensions
- Casual screen recording (HDCP blocks it on protected paths)
- Link sharing (each playback is a user-bound short-lived OTP)

It **does not** stop a determined user with a second phone camera. The defense for that is the dynamic watermark — every playback burns viewer email + IP into the video, so any leak traces back to a specific account.

## Hosting (planned)

- **Frontend** → Vercel (apex `myfundedacademy.com`)
- **Backend** → Hetzner CCX13 (4 GB) + PM2 + nginx, on `api.myfundedacademy.com`
- **DB** → Neon (dev) → DigitalOcean Managed Postgres (prod)
- **Redis** → Upstash serverless
- **Video** → VdoCipher CDN
- **Storage** → DO Spaces `mfa-prod`
- **DNS / WAF** → Cloudflare

See `server/.env.example` and `frontend/.env.example` for required environment variables.
