# CampuxLegacy

> Preserving the story of every graduating class — a premium digital yearbook for African universities.

## Quick start

```bash
cd app
npm install
npm run dev
```

Then open http://localhost:3000

The app boots in **demo mode** by default — full seed data, no Firebase project required. To wire up real Firebase, copy `.env.local.example` → `.env.local` and fill in your project credentials.

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lenis (smooth scroll), Radix UI primitives.
- **Backend:** Firebase Cloud Functions (Node 20, TypeScript), Cloud Firestore, Cloud Storage, Firebase Auth.
- **Server-side API:** Next.js route handlers under `/src/app/api/*` that proxy to the Admin SDK when configured (otherwise demo mode).
- **CI/CD:** GitHub Actions → Firebase Hosting (preview channels per PR, prod deploy on `main`).

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server on :3000 |
| `npm run build` | Production build |
| `npm run emulators` | Run Firebase emulator suite |
| `npm run deploy` | Full deploy (hosting + functions + rules) |

## Routes

- `/` — Animated landing page
- `/universities` — Browse enrolled universities
- `/universities/[slug]` — University home with class list
- `/universities/[slug]/[year]` — Class yearbook grid
- `/g/[id]` — Graduate magazine-style profile
- `/search` — Global search
- `/sign-in`, `/sign-up` — Auth
- `/dashboard` — Student dashboard with live preview
- `/for-schools` — Onboarding request form
- `/about` — Mission

## Backend

- `functions/` — Cloud Functions (triggers, callables, scheduled jobs)
- `firestore.rules` — Security rules
- `firestore.indexes.json` — Composite indexes
- `storage.rules` — Storage rules

## Deployment

Push to `main` → GitHub Actions deploys to Firebase Hosting + Functions automatically.
