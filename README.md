# CampuxLegacy

> Preserving the story of every graduating class — a premium digital yearbook for African universities.

CampuxLegacy turns once-in-a-lifetime graduation moments into a lasting digital archive. Verified profiles, written memories, goodwill messages — captured, moderated, and cryptographically sealed once a class graduates.

## Highlights

- **Next.js 14 (App Router)** with TypeScript, Tailwind, Framer Motion
- **Firebase** for Auth, Firestore, Storage, and Cloud Functions
- **Firebase App Hosting** for the web app, GitHub Actions for functions and rules
- **Real role-based access** via Firebase custom claims (`superadmin`, `university_admin`, `rep`, etc.)
- **Server-side session cookies** signed by the Admin SDK — no raw ID tokens in the browser
- **Premium UI** — magazine-style graduate profiles, animated reveals, ⌘K command palette, skeleton loading states

## Structure

```
app/        Next.js + Firebase Functions monorepo
planning/   Design notes (gitignored secrets)
```

The interesting source lives under [`app/`](app/). See [`app/README.md`](app/README.md) for the full developer guide: env vars, scripts, schema, deployment.

## Quick start

```bash
cd app
npm install
npm run dev
```

Opens at http://localhost:3000 in **demo mode** with seeded data — no Firebase project required.

To wire up real Firebase, copy `app/.env.local.example` → `app/.env.local` and fill in your project credentials. Details in [`app/README.md`](app/README.md#environment-variables).

## Features

### For students
- Magazine-style graduate profile pages with portrait, quote, bio, memories, and goodwill messages
- Personal dashboard: edit profile, upload portrait, add memories, control privacy, submit for review
- "Claim my profile" flow links your Firebase Auth user to a pre-created graduate record

### For universities
- Onboarding request form for new institutions
- Per-university hub, class yearbooks by year, sealed-class lock indicator
- Crest, branding colour, motto on the public university page

### For admins
- Live metrics dashboard (graduates, classes, onboarding queue, pending goodwills, contact inbox)
- Onboarding moderation, goodwill moderation, contact inbox, audit log
- Role manager — grant/revoke custom claims by email
- ⌘K command palette for fast navigation
- One-click **class sealing**: snapshots every approved graduate into an immutable archive with a SHA-256 manifest

## Deployment

- **Web app:** Firebase App Hosting auto-deploys from `main` (configure once in Firebase Console → App Hosting)
- **Functions + rules + indexes:** GitHub Actions ([app/.github/workflows/deploy-prod.yml](app/.github/workflows/deploy-prod.yml)) on every push to `main` that touches functions or rules
- **Secrets:** `FIREBASE_SA_PROD` (service account JSON) in repo secrets; admin SDK credentials in App Hosting secrets

## License

All rights reserved.
