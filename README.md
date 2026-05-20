<div align="center">

# CampuxLegacy

**Preserving the story of every graduating class — a premium digital yearbook for African universities.**

[![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%C2%B7%20Firestore%20%C2%B7%20Storage%20%C2%B7%20Functions-FFCA28?logo=firebase&logoColor=000)](https://firebase.google.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0080?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/license-All_rights_reserved-111)](#license)

</div>

CampuxLegacy turns once-in-a-lifetime graduation moments into a lasting digital archive. Verified profiles, written memories, goodwill messages — captured, moderated, and cryptographically sealed when a class graduates.

---

## Highlights

- **Next.js 14 (App Router)** with TypeScript, Tailwind, Framer Motion
- **Firebase** for Auth, Firestore, Storage, and Cloud Functions
- **Firebase App Hosting** for the web app; GitHub Actions for functions and rules
- **Role-based access** via Firebase custom claims (`superadmin`, `university_admin`, `rep`, `student`, …)
- **Server-side session cookies** signed by the Admin SDK — no raw ID tokens in the browser
- **Premium UI** — magazine-style graduate profiles, animated reveals, ⌘K command palette, skeleton loading states

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) · React 18 · TypeScript 5 |
| Styling | Tailwind CSS 3 · Framer Motion · Radix UI primitives |
| Data | Cloud Firestore (nested schema) · Cloud Storage |
| Auth | Firebase Auth · session cookies · custom claims |
| Backend | Cloud Functions (Node 20) · Sharp (portrait variants) |
| Hosting | Firebase App Hosting (web) · Firebase (functions/rules) |
| CI/CD | GitHub Actions |

## Quick start

```bash
cd app
npm install
npm run dev
```

Opens at <http://localhost:3000> in **demo mode** with seeded data — no Firebase project required.

To wire up real Firebase, copy `app/.env.local.example` → `app/.env.local` and fill in your project credentials. Full env reference in [`app/README.md`](app/README.md#environment-variables).

## Project structure

```
.
├── app/                              Next.js + Firebase monorepo
│   ├── src/app/                      App Router pages (public, /admin, /dashboard, /api)
│   ├── src/components/               UI + admin components
│   ├── src/lib/                      auth, Firestore, types, demo data
│   ├── functions/                    Cloud Functions (Node 20, TypeScript)
│   ├── firestore.rules               Security rules
│   ├── storage.rules                 Storage rules
│   ├── apphosting.yaml               Firebase App Hosting config
│   └── README.md                     Developer guide
└── README.md                         You are here
```

## Features

### For students
- Magazine-style graduate profile pages — portrait, quote, bio, memories, goodwill messages
- Personal dashboard: edit profile, upload portrait, add memories, control privacy, submit for review
- "Claim my profile" flow links a Firebase Auth user to a pre-created graduate record (and mints the storage upload claim)

### For universities
- Onboarding request form for new institutions
- Per-university hub, class yearbooks by year, sealed-class lock indicator
- Crest, branding colour, motto on the public university page

### For admins
- Live metrics dashboard (graduates, classes, onboarding queue, pending goodwills, contact inbox)
- Onboarding moderation, goodwill moderation, contact inbox, audit log
- **Role manager** — grant/revoke custom claims by email
- **⌘K command palette** for fast navigation
- **One-click class sealing** — snapshots every approved graduate into an immutable archive with a SHA-256 manifest

## Architecture

- **Canonical schema is nested**: `universities/{u}/classes/{c}/graduates/{g}` with sub-collections for `memories` and `goodwills`. Graduate docs denormalise university/class fields so `collectionGroup('graduates')` searches need no joins.
- **Public submissions** (onboarding, goodwill, contact) cannot write to Firestore directly — they go through Next API routes that use the Admin SDK. Direct client writes are blocked in `firestore.rules`.
- **Portrait uploads** require a `graduateIds.{gid}=true` custom claim, minted server-side the moment a user claims their profile.
- **Sealing** clones every `approved` graduate into an immutable `archive/{id}` subdoc, flips the class status, and writes a SHA-256 manifest into the audit log.

## Deployment

- **Web app:** Firebase App Hosting auto-deploys from `main` after a one-time connection in the Firebase Console (App Hosting → New backend → root `app/`).
- **Functions + rules + indexes:** GitHub Actions in [.github/workflows/deploy-prod.yml](.github/workflows/deploy-prod.yml) runs on every push to `main` that touches functions or rules.
- **Secrets:** `FIREBASE_SA_PROD` (service-account JSON) in the GitHub repo. Admin SDK credentials live in App Hosting secrets — never committed.

See [`app/README.md`](app/README.md#deployment) for the full deployment + bootstrap walkthrough.

## License

All rights reserved © 2026 thalamux.
