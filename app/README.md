# CampuxLegacy

> Preserving the story of every graduating class — a premium digital yearbook for African universities.

## Quick start

```bash
cd app
npm install
npm run dev
```

Then open http://localhost:3000

The app boots in **demo mode** by default (seeded data, no Firebase project required). To wire up real Firebase, set the env vars below in `.env.local`.

## Environment variables

### Client (public — safe to expose)

| Var | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | yes | Web SDK key from Firebase Console |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | yes | e.g. `campuxlegacy.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | yes | `campuxlegacy` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | yes | e.g. `campuxlegacy.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | yes |  |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | yes |  |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | no | Analytics |
| `NEXT_PUBLIC_USE_EMULATORS` | no | `true` for local emulator suite |
| `NEXT_PUBLIC_DEMO_MODE` | no | `true` to show seed data even with Firebase configured |

### Server (secrets — never commit)

| Var | Required | Notes |
|---|---|---|
| `FIREBASE_ADMIN_PROJECT_ID` | yes (prod) | From the service-account JSON |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | yes (prod) | From the service-account JSON |
| `FIREBASE_ADMIN_PRIVATE_KEY` | yes (prod) | From the service-account JSON. Quote the value so `\n` is preserved literally |
| `SESSION_COOKIE_DAYS` | no | Session cookie lifetime, default `5` |

Without the server vars, the admin SDK falls back to demo mode: admin pages read in-memory data and `/api/admin/*` skip token verification. With them set, sessions are real Firebase session cookies, admin pages read from Firestore, and admin API routes require the `superadmin` or `university_admin` custom claim.

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lenis, Radix UI primitives.
- **Backend:** Firebase Cloud Functions (Node 20, TypeScript), Cloud Firestore, Cloud Storage, Firebase Auth.
- **Hosting:** Firebase App Hosting (Next.js native), configured via `apphosting.yaml`.
- **CI/CD:** GitHub Actions for functions + rules deploy on push to `main`; App Hosting auto-deploys the Next app from the connected branch.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server on :3000 |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js ESLint |
| `npm run emulators` | Run Firebase emulator suite |
| `npm run deploy:functions` | Deploy only Cloud Functions |
| `npm run deploy:rules` | Deploy Firestore + Storage rules |

## Schema

Graduate data is **nested**: `universities/{uniId}/classes/{classId}/graduates/{gradId}` with sub-collections for `memories` and `goodwills`. See [src/lib/types.ts](src/lib/types.ts) for the canonical shape. Top-level `graduates/{id}` is NOT canonical — if you see writes to it, fix them.

## Routes

- `/` — Animated landing page
- `/universities` — Browse enrolled universities
- `/universities/[slug]` — University home with class list
- `/universities/[slug]/[year]` — Class yearbook grid
- `/g/[id]` — Graduate magazine-style profile
- `/search` — Global search
- `/sign-in`, `/sign-up` — Auth (sets a server session cookie via `/api/session`)
- `/dashboard` — Student dashboard (requires sign-in when Firebase Admin is configured)
- `/admin/*` — Admin console (requires `superadmin` or `university_admin` custom claim)
- `/for-schools` — Onboarding request form
- `/about`, `/contact` — Marketing pages

## Auth & roles

Custom claims are minted by the `setRole` callable Cloud Function. To bootstrap the first admin, call it once from a privileged context (e.g. a one-shot Cloud Shell or an admin SDK script):

```ts
await getAuth().setCustomUserClaims(uid, { roles: { superadmin: true } });
```

After that, `setRole` is locked to existing superadmins.

## Backend

- `functions/` — Cloud Functions (triggers, callables, scheduled jobs)
- `firestore.rules` — Security rules
- `firestore.indexes.json` — Composite indexes
- `storage.rules` — Storage rules

## Deployment

1. **Firebase App Hosting** auto-deploys the Next.js app from the branch you connect in the Firebase Console.
2. **GitHub Actions** ([.github/workflows/deploy-prod.yml](.github/workflows/deploy-prod.yml)) deploys functions, Firestore rules/indexes, and Storage rules on push to `main` (only when the relevant paths change).

Required GitHub repo secret: `FIREBASE_SA_PROD` — the full service-account JSON.
