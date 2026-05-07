# My Funded Academy (MFA) — Project Reference

A **multi-instructor trading courses marketplace**. DRM-protected video lessons, one-time + subscription purchases, certificates, quizzes, English + Arabic with RTL.

Sister project to [Funded For You](https://github.com/Yussif20/fundedforyou) — runs on its own infrastructure (separate repo, DB, Stripe account, host).

> **Status: MVP for client demo.** Built on $0/mo free-tier infra to validate the product with a client. Scope is intentionally trimmed (no Stripe Connect, no instructor self-signup, no queues, no discussions). Once the client greenlights the project, the stack and scope expand.

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

| Batch | MVP scope                                                                         |
| ----: | --------------------------------------------------------------------------------- |
|  0 ✅ | Scaffolding (shipped)                                                             |
|     1 | `auth` (signup/login/email-verify/pwd-reset) + roles + admin seed                 |
|     2 | Admin-managed instructors + course CRUD (admin-only authoring) + VdoCipher upload |
|     3 | Categories + featured courses + admin publishing                                  |
|     4 | Catalog + Stripe Checkout (one-time) + Stripe Billing (subscription) + webhooks   |
|     5 | Course player with DRM OTP + watermark + progress tracking                        |
|     6 | Quizzes + auto-generated certificates + public verification page                  |
|     7 | Reviews/ratings                                                                   |
|     8 | Arabic translations + RTL polish                                                  |
|     9 | Demo deploy (Vercel + Render + UptimeRobot) + seed demo data                      |

**Cut from MVP, deferred until client signoff:** Stripe Connect (revenue splits), instructor self-signup application flow, BullMQ + Redis queues, discussions/Q&A, wishlist, coupons.

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

## Hosting (MVP — all $0/mo)

- **Frontend** → Vercel free tier (apex `myfundedacademy.com`)
- **Backend** → Render free tier on `api.myfundedacademy.com`, kept warm by a UptimeRobot HTTP pinger every 10 min
- **DB** → Neon free tier (3 GB)
- **Storage** → Cloudflare R2 free tier (10 GB, zero egress fees)
- **Video** → VdoCipher free trial CDN
- **Email** → Resend free tier
- **DNS / WAF** → Cloudflare free tier

Post-signoff, this stack is expected to migrate to a paid host (Hostinger VPS, Hetzner, or similar) chosen with the client's input.

See `server/.env.example` and `frontend/.env.example` for required environment variables.
