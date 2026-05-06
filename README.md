# My Funded Academy

Multi-instructor trading courses marketplace. DRM-protected video, one-time + subscription payments, English + Arabic.

```
myfundedacademy/
├── frontend/   Next.js 16 (React 19) — http://localhost:3000
├── server/     Express 5 + TypeScript — http://localhost:5000
└── CLAUDE.md
```

## Quick start

```bash
# Server
cd server
npm install
cp .env.example .env   # fill in values
npx prisma generate
npm run dev

# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```

See `CLAUDE.md` for the full project reference.
