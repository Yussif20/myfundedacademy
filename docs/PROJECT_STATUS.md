# My Funded Academy — Project Status & Roadmap

_Last updated: 2026-05-07_

## 1. Executive Summary

**My Funded Academy (MFA)** is a multi-instructor trading-courses marketplace built bilingually (English + Arabic with full RTL). The MVP is **fully deployed and demo-ready** on free-tier infrastructure: students can sign up, browse courses, pay via Stripe (test mode), watch DRM-protected video, take quizzes, and earn verifiable certificates.

The client has approved the MVP as a starting point and asked for the UI to be elevated to a "dashing" production-grade look. This document is the single source of truth for **what's shipped**, **what's missing**, and **what changes for the real launch**.

---

## 2. Live URLs

| Resource                           | URL                                         |
| ---------------------------------- | ------------------------------------------- |
| Frontend (live demo)               | https://myfundedacademy.netlify.app         |
| Backend API                        | https://mfa-api-8yzb.onrender.com           |
| Health check                       | https://mfa-api-8yzb.onrender.com/health    |
| Repo                               | https://github.com/Yussif20/myfundedacademy |
| Production domain (owned, unwired) | myfundedacademy.com                         |

---

## 3. What's Shipped

The platform spans **31 user-facing routes** plus a complete admin dashboard.

### Authentication & accounts

- Signup, login, email verification, forgot/reset password.
- Account dashboard with: my courses, billing & order history, my certificates.
- JWT access + refresh-token rotation, bcrypt-hashed passwords, httpOnly cookies.

### Public catalog

- Home, courses listing, category pages, instructors directory, pricing.
- Course detail with reviews, free preview lessons, instructor bio, curriculum tree.

### Learning experience

- Classroom with curriculum sidebar + per-lesson progress.
- Mark-complete + auto-advance to next lesson.
- Quizzes — multiple choice, auto-graded, configurable passing score, retakes, per-question explanations.
- Auto-issued certificates on course + quiz completion.
- Public certificate verification page (anyone with the code can verify).

### Payments

- Stripe Checkout — one-time course purchase (lifetime access).
- Stripe Subscription — Starter, Pro, Pro Annual tiers.
- Stripe Customer Portal for self-serve billing.
- Order history.
- Webhook signed and delivering 200 in production.

### Reviews

- 5-star ratings + optional title/body, enrollment-gated.
- Average rating + 1–5 distribution histogram per course.

### Admin dashboard

- Manage courses (create, edit, sections, lessons), categories, instructors.
- Direct uploads: thumbnails to Cloudflare R2 via presigned PUT, videos to VdoCipher.
- Quiz authoring with bilingual question/option fields.

### DRM video

- Widevine + FairPlay + PlayReady DRM via VdoCipher.
- Watermarked playback OTP — viewer email + IP burned per session.
- CSS overlay watermark rotating across 6 positions every 5 seconds.
- Single-use, viewer-bound playback tokens.

### Internationalization

- English + Arabic with full RTL across every page (auth, catalog, classroom, account, admin).
- One-click locale toggle in the header.

---

## 4. Architecture (Today)

```
                    Browser (EN/AR + RTL)
                            │
                            │ HTTPS
                            ▼
              ┌──────────────────────────┐
              │ Netlify (Next.js 16)     │
              │ frontend                 │
              └────────────┬─────────────┘
                           │ /api/v1/*
                           ▼
              ┌──────────────────────────┐
              │ Render (Express 5)       │
              │ + Prisma 6.19            │
              └────────────┬─────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
  ┌──────────┐      ┌─────────────┐    ┌─────────────┐
  │ Neon     │      │ Cloudflare  │    │ VdoCipher   │
  │ Postgres │      │ R2          │    │ DRM video   │
  └──────────┘      └─────────────┘    └─────────────┘
                           │
                           ▼
                     ┌────────────┐    ┌──────────────┐
                     │ Stripe     │    │ Resend       │
                     │ test mode  │    │ (stubbed)    │
                     └────────────┘    └──────────────┘
```

**Kept warm**: UptimeRobot pings `/health` every 5 minutes so Render's free tier doesn't cold-start during demos.

---

## 5. Current Tech Stack

| Layer                     | Technology                          | Version              |
| ------------------------- | ----------------------------------- | -------------------- |
| **Frontend framework**    | Next.js                             | 16.1.6               |
|                           | React                               | 19.2.0               |
|                           | TypeScript                          | 5.9                  |
| **Frontend UI**           | Tailwind CSS                        | 4                    |
|                           | shadcn/ui (new-york) + Radix UI     | latest               |
|                           | Framer Motion                       | latest               |
|                           | sonner (toasts)                     | latest               |
|                           | lucide-react (icons)                | latest               |
| **Frontend state & data** | Redux Toolkit + RTK Query           | latest               |
|                           | next-intl                           | latest               |
|                           | React Hook Form + Zod               | 4.1                  |
| **Backend**               | Express                             | 5.1.0                |
|                           | TypeScript                          | 5.9                  |
|                           | Prisma ORM                          | 6.19.2               |
|                           | jsonwebtoken                        | 9.0.2                |
|                           | bcrypt                              | 5.1.1                |
|                           | i18next                             | latest               |
| **Integrations**          | Stripe SDK                          | 17.7.0               |
|                           | AWS SDK (S3 / R2)                   | ^3.700               |
|                           | VdoCipher API                       | direct HTTP          |
|                           | Resend                              | direct HTTP (no SDK) |
| **Database**              | PostgreSQL (Neon)                   | 18                   |
| **Hosting**               | Frontend → Netlify free             | —                    |
|                           | Backend → Render free               | —                    |
|                           | DB → Neon free                      | —                    |
|                           | Object storage → Cloudflare R2 free | —                    |
| **Pinger**                | UptimeRobot free (5-min checks)     | —                    |

---

## 6. What's Missing for Production

### 6a. UI polish — _client's primary ask_

- Marketing-grade landing page (current home is functional but flat — needs hero, value props, social proof, instructor showcase, conversion-focused pricing CTA).
- Hero & section animations using **Framer Motion** (already installed, currently under-used).
- Course card v2 — hover preview video, instructor avatar, rating prominently displayed.
- Skeleton loaders during route transitions and data fetches.
- Toast notifications via **sonner** (already installed) for success/error feedback.
- Admin dashboard with charts (Recharts or Tremor for revenue, enrollments, completion rates).
- Branded illustrations for empty states, 404, error pages.
- Custom video player chrome over the VdoCipher iframe.
- Polished dark/light theme with smooth transition.
- Page-level micro-interactions (button hover, focus rings, cursor states).

### 6b. Operational gaps

- **Email is stubbed** — `server/src/lib/email/index.ts:21` writes verification links to console. Resend integration is wired but disabled until `RESEND_API_KEY` is set in Render env.
- **Stripe is in test mode** — no real money moves until business KYC, live API keys, and a live webhook destination are configured.
- **No custom domain** — using `netlify.app` and `onrender.com` subdomains. Client owns `myfundedacademy.com` but it's unwired.
- **VdoCipher trial** — limited bandwidth quota; production needs paid plan.
- **Render free tier** sleeps after 15 minutes of inactivity (mitigated by UptimeRobot, but cold restarts are still slower than a paid plan).
- **Neon free tier** — small storage cap, no point-in-time recovery.
- **No legal pages** — Terms of Service, Privacy Policy, Refund Policy missing.

### 6c. Monitoring & observability

- No error tracking (no Sentry).
- No product analytics (no PostHog / Plausible / GA4).
- No structured server logging — `console.log` only; Render's log search is unindexed.
- UptimeRobot covers HTTP pings but not deep checks (login flow, checkout flow, video playback).

### 6d. Security & compliance

- No rate limiting on auth endpoints (recommend `express-rate-limit`).
- Basic security headers only — no full Content Security Policy.
- No GDPR data-export / "delete my account" flow.
- No 2FA option for admin accounts.

### 6e. Feature gaps deferred from MVP

- Instructor self-onboarding (currently admin-seeded only).
- Coupons / discount codes.
- Affiliate / referral tracking.
- Stripe Connect for instructor revenue split.
- In-app notifications.
- Discussion threads / Q&A under lessons.
- Wishlist / save-for-later.

---

## 7. Tech Upgrade Path (MVP → Production)

| Layer            | Today (Free MVP)     | Production Recommendation                    | Est. monthly cost  |
| ---------------- | -------------------- | -------------------------------------------- | ------------------ |
| Frontend hosting | Netlify free         | Netlify Pro or Vercel Pro                    | $19–20             |
| Backend hosting  | Render free (sleeps) | Render Standard or DigitalOcean App Platform | $12–25             |
| Database         | Neon free            | Neon Pro (PITR + larger storage)             | $19                |
| Object storage   | Cloudflare R2 free   | Cloudflare R2 pay-as-you-go                  | ~$2                |
| Video DRM        | VdoCipher trial      | VdoCipher paid (per-GB streaming)            | $30+               |
| Email            | Stubbed (console)    | Resend with verified sending domain          | $20                |
| Payments         | Stripe test          | Stripe live (business KYC required)          | 2.9% + $0.30 / txn |
| Domain + DNS     | `*.netlify.app`      | `myfundedacademy.com` via Cloudflare         | $0 (already owned) |
| Error tracking   | None                 | Sentry Team                                  | $26                |
| Analytics        | None                 | PostHog free or Plausible                    | $0–9               |
| Uptime + alerts  | UptimeRobot free     | BetterStack or UptimeRobot Pro               | $7–30              |
| CI/CD            | Auto-deploy only     | + GitHub Actions (typecheck, lint, tests)    | $0 (free tier)     |

**Recurring runway estimate**: **~$150–200/month** in fixed infra + Stripe transaction fees + VdoCipher bandwidth above the included tier. Total cost scales with student count and video minutes streamed.

---

## 8. Real Deployment Plan (Phased)

### Phase 1 — UI overhaul _(client's priority — start next)_

**Goal**: make the platform feel premium without changing the underlying functionality.

- [ ] Redesign marketing landing page (hero, value props, instructor showcase, testimonials, pricing CTA).
- [ ] Course card v2 with hover state + preview.
- [ ] Page transitions + skeleton loaders.
- [ ] Admin dashboard with revenue / enrollment / completion charts.
- [ ] Branded empty-state illustrations.
- [ ] Polished dark/light theme.
- [ ] Custom video player chrome.

**Tech adds**: none. Framer Motion, sonner, and Tremor are already supported.

### Phase 2 — Production infrastructure

- [ ] Wire `myfundedacademy.com` via Cloudflare DNS (CNAME → Netlify, custom domain → Render).
- [ ] Update `BASE_URL_*` env vars on Render + Netlify; rebuild CORS allowlist.
- [ ] Upgrade Render to Standard tier (no sleeping).
- [ ] Upgrade Neon to Pro tier; enable point-in-time recovery.
- [ ] Set up Resend, verify sending domain, set `RESEND_API_KEY` on Render — email stub auto-disables.
- [ ] Complete Stripe business KYC; flip to live keys; create live webhook destination; update `STRIPE_WEBHOOK_SECRET`.
- [ ] Upgrade VdoCipher to paid plan; whitelist production domain.

### Phase 3 — Hardening & ops

- [ ] Add Sentry to frontend + backend (separate DSN per env).
- [ ] Add `express-rate-limit` to `/api/v1/auth/*` routes.
- [ ] Full Content Security Policy via `next.config.ts` headers and Express helmet config.
- [ ] Legal pages: Terms of Service, Privacy Policy, Refund Policy (static MD rendered).
- [ ] Switch server logger to `pino` with structured JSON for Render log search.
- [ ] Enable nightly Neon snapshots + R2 object versioning.
- [ ] GitHub Actions: typecheck + lint on every PR.

### Phase 4 — Growth features

- [ ] Coupons / discount codes (Stripe Coupons API).
- [ ] Instructor self-onboarding + Stripe Connect for revenue split.
- [ ] Q&A discussion threads under lessons.
- [ ] PostHog analytics with funnel tracking.
- [ ] Email campaigns via Resend Audiences (newsletter, course reminders, abandoned-checkout).
- [ ] Wishlist / save-for-later.

---

## 9. Open Questions for Client

Decisions needed before Phase 2 starts:

1. **Branding**: stay with current teal (`#0F766E`) + amber (`#F59E0B`), or refresh?
2. **Pricing tiers**: final names, prices, and feature breakdown for live Stripe products.
3. **Refund window**: 7 / 14 / 30 days? Pro-rated for subscriptions?
4. **Instructor revenue share**: what % does the platform keep? (Drives Stripe Connect setup.)
5. **Mobile**: PWA or native app, and at which phase?
6. **Community**: forum on-platform, or off-platform (Discord / Slack / Telegram)?
7. **Launch strategy**: soft-launch with limited courses, or full marketing push at launch?

---

## 10. Appendix

### Dev commands

```bash
# Server
cd server
npm install
npm run dev                # http://localhost:5000
npm run prisma:gen         # generate Prisma client + push schema
npm run gn-route           # scaffold a new API module
docker compose up -d       # local Postgres on port 3500

# Frontend
cd frontend
npm install
npm run dev                # http://localhost:3000
npm run build && npm run lint
```

### Required env vars (production)

**Render (backend)**

- `NODE_ENV=production`
- `DATABASE_URL` (Neon)
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_VERIFY_SECRET` (48-byte base64url each)
- `BASE_URL_SERVER`, `BASE_URL_CLIENT`, `CORS_ORIGINS`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_*` IDs
- `RESEND_API_KEY`, `EMAIL_FROM`
- `VDOCIPHER_API_SECRET`
- `R2_*` keys (account ID, access key, secret, bucket, public URL)
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` (seeded super-admin)

**Netlify (frontend)**

- `NEXT_PUBLIC_BASE_SERVER_URL` (e.g. `https://api.myfundedacademy.com`)
- Any other `NEXT_PUBLIC_*` flags

### Repo layout

```
myfundedacademy/
├── frontend/                  Next.js 16 + React 19
│   ├── src/app/[locale]/      app router with EN/AR
│   ├── src/redux/             RTK Query APIs
│   └── messages/              en.json + ar.json
├── server/                    Express 5 + Prisma
│   ├── src/app/               feature modules (auth, courses, …)
│   ├── src/lib/               shared infra (db, email, storage, video)
│   └── prisma/schema/         split Prisma schema
├── docs/                      this folder
├── client-brief.html          one-page client demo brief (PDF-ready)
├── README.md
└── CLAUDE.md                  assistant-facing project reference
```

### Internal references

- `README.md` — quick start.
- `CLAUDE.md` — full project reference (used by the AI assistant during development).
- `client-brief.html` — one-page printable feature brief for the client.
