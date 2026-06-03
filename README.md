<div align="center">

# CampuxLegacy

**Preserving the story of every graduating class — a premium digital yearbook for African universities.**

[![Live](https://img.shields.io/badge/live-campuxlegacy.vercel.app-000?logo=vercel&logoColor=white)](https://campuxlegacy.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-Auth%20%C2%B7%20Firestore%20%C2%B7%20Storage-FFCA28?logo=firebase&logoColor=000)](https://firebase.google.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-FF0080?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/license-All_rights_reserved-111)](#license)

🌐 **Live at <https://campuxlegacy.vercel.app>**

</div>

CampuxLegacy turns once-in-a-lifetime graduation moments into a lasting digital archive. Verified profiles, written memories, goodwill messages — captured, moderated, and cryptographically sealed when a class graduates.

---

## Table of contents

- [Highlights](#highlights)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Features](#features)
- [Architecture](#architecture)
- [Routes](#routes)
- [Deployment](#deployment)
- [License](#license)

---

## Highlights

- **Next.js 14 (App Router)** with TypeScript, Tailwind, Framer Motion
- **Firebase** for Auth, Firestore, and Storage on the **Spark (free)** plan
- **Vercel** hosts the Next.js app — SSR + API routes on the free Hobby tier
- **Role-based access** via Firebase custom claims (`superadmin`, `university_admin`, `rep`, `student`, …)
- **Server-side session cookies** signed by the Admin SDK — no raw ID tokens in the browser
- **Premium UI** — magazine-style graduate profiles, animated reveals, ⌘K command palette, skeleton loading states
- **Tamper-evident sealing** — every approved class snapshotted into an immutable archive with a SHA-256 manifest

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) · React 18 · TypeScript 5 |
| Styling | Tailwind CSS 3 · Framer Motion · Radix UI primitives |
| Data | Cloud Firestore (nested schema) · Cloud Storage |
| Auth | Firebase Auth · session cookies · custom claims |
| Hosting | Vercel (Next.js SSR + API routes) |
| Data services | Firebase Spark (Auth · Firestore · Storage) |
| CI/CD | Vercel (auto-deploy on push) · GitHub Actions (rules sync) |

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
├── app/                              Next.js app deployed to Vercel
│   ├── src/app/                      App Router pages (public, /admin, /dashboard, /api)
│   ├── src/components/               UI + admin components
│   ├── src/lib/                      auth, Firestore, types, demo data
│   ├── firestore.rules               Security rules (deployed to campuxlegacy)
│   ├── storage.rules                 Storage rules (deployed to campuxlegacy)
│   └── README.md                     Developer guide
├── scripts/                          One-shot admin scripts (superadmin bootstrap)
├── .github/workflows/                Rules-sync workflow
├── DEPLOY_VERCEL.md                  End-to-end deploy walkthrough
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

## Routes

| Path | Purpose |
|---|---|
| `/` | Animated landing page |
| `/universities` · `/universities/[slug]` · `/universities/[slug]/[year]` | Browse, university hub, class yearbook |
| `/g/[id]` | Magazine-style graduate profile |
| `/search` | Global search |
| `/sign-in` · `/sign-up` | Auth (sets a server session cookie via `/api/session`) |
| `/dashboard` | Student dashboard |
| `/admin/*` | Admin console (gated by `superadmin` / `university_admin` claim) |
| `/for-schools` · `/contact` · `/about` | Marketing + onboarding intake |

## Deployment

Production: <https://campuxlegacy.vercel.app>

- **Vercel** auto-deploys the Next.js app from `app/` on every push to `main` — free Hobby tier handles SSR + API routes. Firebase Admin credentials live in Vercel env vars (`FIREBASE_ADMIN_*`); Web SDK config in `NEXT_PUBLIC_FIREBASE_*`.
- **Firebase Spark (free plan)** provides Auth, Firestore, and Storage on the `campuxlegacy` project. No Cloud Functions — claim minting is handled by the local [`scripts/grant-superadmin.mjs`](scripts/grant-superadmin.mjs).
- **GitHub Actions** ([.github/workflows/deploy-prod.yml](.github/workflows/deploy-prod.yml)) syncs Firestore rules + indexes to `campuxlegacy` when those files change.

See [`DEPLOY_VERCEL.md`](DEPLOY_VERCEL.md) for the full setup walkthrough (env vars, Auth providers, superadmin bootstrap).

## License

All rights reserved © 2026 thalamuxTech.
