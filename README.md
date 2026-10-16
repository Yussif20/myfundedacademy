<p align="center">
  <img src="frontend/public/logo.svg" alt="Nibras · نبراس" height="72" />
</p>

# Nibras · نبراس

A bilingual (English + Arabic, full RTL) course platform for any instructor. Instructors build courses with sections, lessons, attachments and a final quiz. Students buy a course or subscribe, watch DRM-protected video, and earn a certificate anyone can verify.

_Nibras_ (نبراس) is Arabic for a lamp: the light a good teacher holds up for a student.

## Features

- **Catalog**: course and category pages, instructor profiles, free preview lessons, ratings and reviews.
- **Payments**: Stripe Checkout for one-time purchases (lifetime access) and Stripe Billing subscriptions, with a signature-checked, idempotent webhook.
- **Protected video**: VdoCipher DRM (Widevine, FairPlay, PlayReady) with the viewer's email and IP burned into every playback.
- **Course builder**: sections, lessons, reordering, attachments and quizzes, with server-side ownership checks.
- **Certificates**: issued after the final quiz, with a public `/verify/<code>` page.
- **Roles**: student, instructor and admin; email + password auth with rotating refresh tokens.
- **Bilingual**: every page in English and Arabic, and every user-facing field stored in both languages.

## Stack

| Layer    | Technology                                                                      |
| -------- | ------------------------------------------------------------------------------- |
| Frontend | Next.js 16, React 19, Tailwind CSS 4, RTK Query, shadcn/ui, next-intl, Recharts |
| Backend  | Express 5, TypeScript, Prisma 6, Zod                                            |
| Data     | PostgreSQL (Neon), Cloudflare R2 (S3-compatible storage)                        |
| Services | Stripe (test mode), VdoCipher, Resend                                           |

```
nibras/
├── frontend/   Next.js app — http://localhost:3000
├── server/     Express API  — http://localhost:5000/api/v1
└── docs/       project status and roadmap
```

## Quick start

Requires Node.js 20+ and a Postgres connection string.

```bash
# API
cd server
npm install
cp .env.example .env   # fill in DATABASE_URL and secrets
npx prisma generate
npx prisma db push     # create the tables
npm run dev

# Web (in a second terminal)
cd frontend
npm install
npm run dev
```

The frontend reads these optional variables (from `frontend/.env.local`):

| Variable                          | Default                              |
| --------------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_BASE_SERVER_URL_DEV` | `http://localhost:5000`              |
| `NEXT_PUBLIC_BASE_SERVER_URL`     | `https://api.nibras.yousefayman.com` |
| `NEXT_PUBLIC_SITE_URL`            | `https://nibras.yousefayman.com`     |
| `NEXT_PUBLIC_CONTACT_EMAIL`       | `hello@nibras.yousefayman.com`       |

See [`CLAUDE.md`](CLAUDE.md) for the full project reference and [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) for what's built and what's next.

## Author

Built by [Yousef Ayman](https://yousefayman.com) ([@Yussif20](https://github.com/Yussif20)).
