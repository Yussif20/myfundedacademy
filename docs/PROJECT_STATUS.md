# Nibras · نبراس — Project Status & Roadmap

_Last updated: 2026-10-15_

## 1. Summary

**Nibras** (نبراس, "lamp") is a bilingual course platform for any instructor: English + Arabic with full RTL. Students can sign up, browse courses, pay via Stripe (test mode), watch DRM-protected video, take quizzes and earn verifiable certificates. Instructors build their own courses; admins manage the catalog.

It started as a niche academy demo and was rebranded on 2026-10-15 into a general platform. The database schema was already generic, so the rebrand touched only names, copy, branding and the home page.

---

## 2. Where it runs

| Resource         | URL / location                                   |
| ---------------- | ------------------------------------------------ |
| Repo             | https://github.com/Yussif20/myfundedacademy      |
| Frontend (demo)  | Netlify free tier (still on its pre-rebrand URL) |
| Backend API      | Render free tier, `server/render.yaml`           |
| Planned demo URL | `nibras.yousefayman.com` (not wired yet)         |

The deployments keep their old service names and URLs until they are moved; the rebrand changed code defaults only.

---

## 3. What works

### Accounts

- Signup, login, email verification, forgot/reset password.
- Account area: my courses, billing and order history, my certificates.
- JWT access tokens + rotating refresh tokens in an httpOnly cookie, bcrypt-hashed passwords.
- Roles: student, instructor, admin.

### Catalog

- Home, course list, category pages, instructor directory and profiles, pricing.
- Course page with reviews, free preview lessons, instructor bio and curriculum.

### Learning

- Classroom with a curriculum sidebar and per-lesson progress; mark complete and auto-advance.
- Final quiz: multiple choice, auto-graded, passing score, retakes, per-question explanations.
- Certificates issued after the quiz, with a public `/verify/<code>` page.

### Payments

- Stripe Checkout for one-time purchases (lifetime access).
- Stripe subscriptions: Starter, Pro, Pro Annual; Customer Portal for self-serve billing.
- Signature-checked webhook with idempotent enrolment.

### Instructors and admin

- Course builder: sections, lessons, reorder, attachments, with server-side ownership checks.
- Thumbnails upload to Cloudflare R2 via presigned PUT; videos upload to VdoCipher.
- Admin management of courses, categories, instructors, students and users.

### Protected video

- VdoCipher DRM (Widevine, FairPlay, PlayReady).
- Viewer email + IP burned into every playback, plus a rotating CSS overlay watermark.

---

## 4. Known gaps

- **Instructor quiz editing returns 403**: `/quizzes/admin/*` is admin-only (`server/src/app/quizzes/quizzes.route.ts`).
- **Catalog filters apply to the current page only** (12 courses), not the whole catalog.
- **Admin revenue and enrolment charts use mock data** (`frontend/src/components/admin/dashboard-charts.tsx`).
- **No "resume where you left off"**: `Progress.lastWatchedSeconds` is never written.
- **No approval queue**: instructors publish directly; `PENDING` / `REJECTED` statuses exist but are unused.
- **Client-rendered pages only**: no per-course SEO metadata.
- **No demo data or accounts**: the only seed is the admin.
- **No tests**, and lint doesn't fail CI (`|| true`).
- **Home-page testimonials are illustrative**: invented people in `frontend/src/lib/showcase.ts`.
- **VdoCipher is paid after its trial**: a public demo needs a free video fallback.

---

## 5. Architecture

```
                    Browser (EN/AR + RTL)
                            │ HTTPS
                            ▼
              ┌──────────────────────────┐
              │ Next.js 16 (Netlify)     │
              └────────────┬─────────────┘
                           │ /api/v1/*
                           ▼
              ┌──────────────────────────┐
              │ Express 5 + Prisma 6     │
              │ (Render)                 │
              └────────────┬─────────────┘
        ┌──────────────────┼──────────────────┬──────────────┐
        ▼                  ▼                  ▼              ▼
  ┌──────────┐      ┌─────────────┐    ┌─────────────┐ ┌──────────┐
  │ Neon     │      │ Cloudflare  │    │ VdoCipher   │ │ Stripe   │
  │ Postgres │      │ R2          │    │ DRM video   │ │ + Resend │
  └──────────┘      └─────────────┘    └─────────────┘ └──────────┘
```

---

## 6. Stack

| Layer              | Technology                                                                |
| ------------------ | ------------------------------------------------------------------------- |
| Frontend           | Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4, shadcn/ui, Radix UI |
| Frontend state     | Redux Toolkit + RTK Query, redux-persist, next-intl                       |
| Forms / validation | React Hook Form + Zod                                                     |
| Motion             | Framer Motion, three.js (hero scene)                                      |
| Backend            | Express 5, TypeScript 5.9, Prisma 6.19, jsonwebtoken, bcrypt, i18next     |
| Integrations       | Stripe SDK, AWS SDK (R2), VdoCipher API, Resend (HTTP)                    |
| Hosting            | Netlify, Render, Neon, Cloudflare R2 — all free tiers                     |

---

## 7. Roadmap

1. **Try the demo**
   - Idempotent seed: about 8 general courses (web development, design, Arabic calligraphy, business…), 3 instructors, quizzes, reviews, and a student with partial progress, a certificate and an order.
   - One-click "Try as student / instructor", nightly reset, write guards, demo emails auto-verified.
   - Stripe test-card banner (4242…).
   - Free video fallback for demo courses (MP4/HLS from R2 behind a provider switch); VdoCipher stays for real use.
2. **Learning fixes**: instructor quiz 403, resume playback from `lastWatchedSeconds`, course approval queue, optional lesson notes.
3. **Real analytics**: live admin aggregates; instructor revenue and enrolment over time, completion funnel and per-lesson drop-off.
4. **Catalog that scales**: server-side search, filter and sort with Postgres full-text search; server-rendered course and instructor pages with metadata, `sitemap.ts` and JSON-LD.
5. **Engineering credibility**: Vitest + Supertest for access rules, ownership and the Stripe webhook; Playwright for checkout and the learning flow; CI that fails on lint and test errors.

---

## 8. Appendix

### Dev commands

```bash
# Server
cd server
npm install
npm run dev                # http://localhost:5000
npm run prisma:gen         # generate the Prisma client
npm run typecheck
npm run gn-route <name>    # scaffold a new API module

# Frontend
cd frontend
npm install
npm run dev                # http://localhost:3000
npm run typecheck && npm run build
```

### Environment variables

**Server** — see `server/.env.example` (placeholders only; never commit real values):
`DATABASE_URL`, `JWT_*`, `INVITE_TOKEN_SECRET`, `BASE_URL_*`, `CORS_ORIGINS`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `EMAIL_FROM`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*`, `VDOCIPHER_API_SECRET`, `S3_*`.

**Frontend** — `NEXT_PUBLIC_BASE_SERVER_URL`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_EMAIL` (see `README.md`).

### Repo layout

```
nibras/
├── frontend/                  Next.js 16 + React 19
│   ├── src/app/[locale]/      App Router with EN/AR
│   ├── src/components/        UI, landing, admin, workspace
│   ├── src/redux/             RTK Query APIs
│   └── messages/              en.json + ar.json
├── server/                    Express 5 + Prisma
│   ├── src/app/               feature modules (auth, courses, quizzes, …)
│   ├── src/lib/               shared infra (db, email, storage, video)
│   └── prisma/schema/         split Prisma schema
├── docs/                      this file
├── README.md
└── CLAUDE.md                  assistant-facing project reference
```
