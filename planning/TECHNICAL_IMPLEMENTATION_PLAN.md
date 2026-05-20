# CampusLegacy — Technical Implementation Plan

> **Preserving the story of every graduating class.**
> A premium, mobile-first, animated digital yearbook platform for universities across Africa.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Design Principles](#2-product-vision--design-principles)
3. [System Architecture (High-Level)](#3-system-architecture-high-level)
4. [Technology Stack](#4-technology-stack)
5. [Repository & Project Structure](#5-repository--project-structure)
6. [Firebase Configuration](#6-firebase-configuration)
7. [Data Model (Firestore + Storage)](#7-data-model-firestore--storage)
8. [User Roles, Access Control & Workflows](#8-user-roles-access-control--workflows)
9. [Frontend Implementation](#9-frontend-implementation)
10. [Animation & Interactivity System](#10-animation--interactivity-system)
11. [Responsive & Mobile-First Strategy](#11-responsive--mobile-first-strategy)
12. [Backend Implementation (Cloud Functions)](#12-backend-implementation-cloud-functions)
13. [Security Rules](#13-security-rules)
14. [Authentication & Onboarding](#14-authentication--onboarding)
15. [Media Pipeline (Photos & Videos)](#15-media-pipeline-photos--videos)
16. [Search, Indexing & Discovery](#16-search-indexing--discovery)
17. [Notifications & Messaging](#17-notifications--messaging)
18. [Privacy, Approvals & "Sealed Archive" Logic](#18-privacy-approvals--sealed-archive-logic)
19. [CI/CD: GitHub → Firebase Hosting](#19-cicd-github--firebase-hosting)
20. [Environments, Branching & Release Strategy](#20-environments-branching--release-strategy)
21. [Observability, Logging & Analytics](#21-observability-logging--analytics)
22. [Performance & SEO](#22-performance--seo)
23. [Accessibility (a11y)](#23-accessibility-a11y)
24. [Testing Strategy](#24-testing-strategy)
25. [Cost & Scalability Notes](#25-cost--scalability-notes)
26. [Roadmap & Delivery Phases](#26-roadmap--delivery-phases)
27. [Risks & Mitigations](#27-risks--mitigations)
28. [Appendix: Naming, Conventions, Checklists](#28-appendix)

---

## 1. Executive Summary

CampusLegacy is a **premium digital yearbook & alumni memory platform** for African universities. This document is the canonical technical blueprint for building, shipping, and operating the platform on **Firebase Hosting**, with the source of truth in **GitHub**, and **automatic deploys on every commit to `main`** through GitHub Actions.

The build prioritises:

- A **premium, editorial, animated** front-end (think: a coffee-table yearbook reimagined as a web app).
- **Mobile-first** responsiveness — most Nigerian/African students reach the web through mid-range Android devices on metered data.
- **Strict privacy** — public details (name, portrait) vs. private details (email, memories) gated by user approval.
- **Operational simplicity** — serverless on Firebase end-to-end so a small team can run it.

---

## 2. Product Vision & Design Principles

| Principle | What it means in build decisions |
|---|---|
| **Editorial, not corporate** | Serif display type for moments, generous whitespace, photo-led layouts. |
| **Mobile-first** | Design every component at 360px first, then scale up. |
| **Privacy by default** | Personal fields are private until the owner approves visibility. |
| **Trust through polish** | Smooth motion, no jank, no broken images, no spinner soup. |
| **Resilience on slow networks** | Lazy media, AVIF/WebP, skeleton states, optimistic UI. |
| **Sealable archive** | Once a class is "sealed", content becomes immutable & versioned. |

---

## 3. System Architecture (High-Level)

```
                 ┌──────────────────────────────────────────────┐
                 │                Users / Devices               │
                 │   Students · Reps · Officials · Alumni · Public │
                 └──────────────┬───────────────────────────────┘
                                │  HTTPS (TLS 1.3)
                                ▼
                 ┌──────────────────────────────────────────────┐
                 │           Firebase Hosting (CDN edge)        │
                 │   Next.js static + SSR via Cloud Functions   │
                 └──────────────┬───────────────────────────────┘
                                │
        ┌───────────────────────┼─────────────────────────────────┐
        ▼                       ▼                                 ▼
┌────────────────┐    ┌────────────────────┐           ┌────────────────────┐
│ Firebase Auth  │    │  Cloud Firestore   │           │  Cloud Storage     │
│ Email · Google │    │  (NoSQL, indexed)  │           │  Photos · Videos   │
│ Phone OTP      │    │                    │           │                    │
└──────┬─────────┘    └──────────┬─────────┘           └─────────┬──────────┘
       │                         │                               │
       │                         ▼                               │
       │              ┌─────────────────────┐                    │
       └──────────────►   Cloud Functions   ◄────────────────────┘
                      │  (HTTPS · Triggers) │
                      │  · approvals        │
                      │  · media transcode  │
                      │  · search sync      │
                      │  · sealing job      │
                      └──────────┬──────────┘
                                 │
                ┌────────────────┼─────────────────┐
                ▼                ▼                 ▼
        ┌────────────┐   ┌──────────────┐   ┌──────────────┐
        │ Algolia /  │   │   SendGrid   │   │  FCM Push    │
        │ Typesense  │   │  Transactional│   │ Notifications│
        └────────────┘   └──────────────┘   └──────────────┘

           GitHub  ──(push to main)──►  GitHub Actions  ──►  Firebase Hosting + Functions
```

---

## 4. Technology Stack

### Frontend
- **Framework:** Next.js 14+ (App Router) — SSR/ISR for SEO, static for marketing.
- **Language:** TypeScript (strict).
- **Styling:** Tailwind CSS + CSS variables for theming, with `clsx` / `tailwind-merge`.
- **UI primitives:** Radix UI + custom components.
- **Animation:** Framer Motion (page & component), GSAP + Lenis (scroll-driven & smooth scroll), Lottie (micro-illustrations).
- **State:** TanStack Query (server cache) + Zustand (light UI state).
- **Forms:** React Hook Form + Zod schemas.
- **Image:** `next/image` with AVIF/WebP, blur placeholders.

### Backend
- **Runtime:** Firebase Cloud Functions (Node 20, TypeScript).
- **Database:** Cloud Firestore (multi-region `nam5` or `eur3`; pick one closest to majority traffic — for Nigeria, default `eur3`).
- **Storage:** Firebase Cloud Storage (regional bucket aligned with Firestore).
- **Auth:** Firebase Authentication (Email/Password, Google, Phone OTP).
- **Search:** Algolia (managed) or self-hosted Typesense on Cloud Run.
- **Media transforms:** Cloud Functions + `sharp` for images; **Mux** or **Cloudflare Stream** for video (transcoding, thumbnails, adaptive streaming).
- **Email:** SendGrid (templated transactional).
- **Push:** Firebase Cloud Messaging.

### DevOps
- **Source:** GitHub.
- **CI/CD:** GitHub Actions → `firebase-tools` deploy.
- **Preview channels:** Firebase Hosting preview URLs per PR.
- **Secrets:** GitHub Encrypted Secrets + Google Secret Manager for runtime.
- **Monitoring:** Firebase Performance, Crashlytics-for-web (Sentry), Google Cloud Logging.

---

## 5. Repository & Project Structure

```
campuslegacy/
├── .github/
│   └── workflows/
│       ├── ci.yml                  # lint, typecheck, test
│       ├── deploy-preview.yml      # PR → Firebase preview channel
│       └── deploy-prod.yml         # main → live
├── apps/
│   ├── web/                        # Next.js front-end
│   │   ├── app/                    # App Router routes
│   │   ├── components/
│   │   ├── lib/                    # firebase client, hooks
│   │   ├── styles/
│   │   └── public/
│   └── admin/                      # (Optional) admin console — same Next app, /admin route
├── functions/                      # Firebase Cloud Functions
│   ├── src/
│   │   ├── http/                   # callable + onRequest
│   │   ├── triggers/               # firestore/storage/auth triggers
│   │   ├── jobs/                   # scheduled: sealing, digests
│   │   └── lib/
│   ├── package.json
│   └── tsconfig.json
├── packages/
│   ├── shared-types/               # Zod schemas + TS types shared by web + functions
│   └── ui/                         # design-system components
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── firebase.json
├── .firebaserc
├── package.json                    # pnpm workspaces
└── README.md
```

**Monorepo tool:** pnpm workspaces + Turborepo for cached builds.

---

## 6. Firebase Configuration

### 6.1 Projects (one per environment)

| Environment | Firebase Project | Domain |
|---|---|---|
| Development | `campuslegacy-dev` | `dev.campuslegacy.app` |
| Staging | `campuslegacy-staging` | `staging.campuslegacy.app` |
| Production | `campuslegacy-prod` | `campuslegacy.app` (+ `www`) |

### 6.2 `firebase.json` (essentials)

```json
{
  "hosting": {
    "site": "campuslegacy-prod",
    "public": "apps/web/.next",
    "cleanUrls": true,
    "trailingSlash": false,
    "rewrites": [
      { "source": "/api/**", "function": "api" },
      { "source": "**",       "function": "nextServer" }
    ],
    "headers": [
      { "source": "**/*.@(js|css|woff2|avif|webp)",
        "headers": [{ "key": "Cache-Control", "value": "public,max-age=31536000,immutable" }] }
    ]
  },
  "firestore": { "rules": "firestore.rules", "indexes": "firestore.indexes.json" },
  "storage":   { "rules": "storage.rules" },
  "functions": [{ "source": "functions", "runtime": "nodejs20" }],
  "emulators": {
    "auth": { "port": 9099 },
    "functions": { "port": 5001 },
    "firestore": { "port": 8080 },
    "storage": { "port": 9199 },
    "hosting": { "port": 5000 },
    "ui": { "enabled": true }
  }
}
```

### 6.3 Custom domain & SSL
Auto-provisioned by Firebase Hosting. Add both apex and `www`. Configure DNS (A + AAAA from Firebase, plus TXT for verification).

---

## 7. Data Model (Firestore + Storage)

Firestore is document-oriented; we model along **read patterns**.

### 7.1 Collections

```
universities/{universityId}
  ├─ schools/{schoolId}
  │   └─ departments/{departmentId}
  ├─ classes/{classId}                   # graduating year, e.g. 2026
  │   ├─ graduates/{graduateId}          # public yearbook entry
  │   │   ├─ memories/{memoryId}
  │   │   └─ goodwills/{goodwillId}
  │   └─ archive/{snapshotId}            # immutable seal snapshots
  └─ representatives/{repId}

users/{uid}                              # 1:1 with Firebase Auth
  ├─ privateProfile (subdoc)             # email, phone, address — never public
  └─ approvals/{approvalId}

invites/{inviteId}                       # rep-issued onboarding tokens

audit/{eventId}                          # security & approval log (write-only)
```

### 7.2 Key documents (TypeScript shapes)

```ts
// graduates/{graduateId}
type Graduate = {
  uid: string | null;                    // null until claimed
  universityId: string;
  schoolId: string;
  departmentId: string;
  classId: string;                       // e.g. "2026"
  fullName: string;                      // PUBLIC
  preferredName?: string;                // PUBLIC
  portrait: { storagePath: string; blurhash: string }; // PUBLIC
  showcaseClipId?: string;               // Mux asset id
  bio?: string;                          // PUBLIC after approval
  quote?: string;                        // PUBLIC after approval
  socials?: { instagram?: string; linkedin?: string }; // PUBLIC if approved
  visibility: {
    bio: 'public'|'connections'|'private';
    contact: 'public'|'connections'|'private';
    memories: 'public'|'connections'|'private';
  };
  status: 'draft'|'pending_review'|'approved'|'sealed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  sealedAt?: Timestamp;
};
```

### 7.3 Storage layout

```
gs://campuslegacy-prod.appspot.com/
  universities/{uid}/branding/{file}
  graduates/{graduateId}/portrait/original.jpg
  graduates/{graduateId}/portrait/avif/...
  graduates/{graduateId}/showcase/{muxAssetId}.poster.jpg
  goodwills/{goodwillId}/audio.mp3
```

### 7.4 Indexes (`firestore.indexes.json`)

Composite indexes for:
- `graduates` by `(universityId, classId, status)` ordered `fullName`.
- `graduates` by `(schoolId, classId)` ordered `updatedAt desc`.
- `goodwills` by `(graduateId, createdAt desc)`.

---

## 8. User Roles, Access Control & Workflows

### 8.1 Roles

| Role | Description | How assigned |
|---|---|---|
| `visitor` | Unauthenticated. Can view public summaries. | Default. |
| `student` | Graduating student with a profile. | Self sign-up or invite link. |
| `alumni` | Sealed-class graduate. | Auto-converted on class seal. |
| `rep` | School/department representative. | Invite by university admin. |
| `university_admin` | Institution-level admin. | Invite by superadmin. |
| `official` | Academic / non-academic staff displayed in archive. | Created by rep/admin. |
| `superadmin` | CampusLegacy operator. | Manual via Firebase Auth custom claims. |

Roles are stored as **Firebase Auth custom claims** + mirrored in `users/{uid}.roles` for client UX. Server trust = claims only.

### 8.2 Core workflows

```
┌──────────────────────────────────────────────────────────────────┐
│  1. UNIVERSITY ONBOARDING                                        │
│  superadmin → creates university doc → invites university_admin │
│       → configures branding, schools, departments, class year   │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  2. REP ONBOARDING                                               │
│  university_admin → invites reps (per school/dept)               │
│  rep → receives signed invite link → creates account → verified  │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  3. STUDENT DATA INTAKE                                          │
│  rep → bulk import roster (CSV) OR student → self sign-up        │
│  → student claims profile via invite or matched email            │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  4. PROFILE BUILD                                                │
│  student → uploads portrait, showcase clip, memories, quote      │
│  student → sets per-field visibility                             │
│  student → submits for review                                    │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  5. REVIEW & APPROVE                                             │
│  rep → flags issues / approves                                   │
│  student → re-confirms before final lock                         │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  6. LAUNCH                                                       │
│  university_admin → publishes class → status = 'approved'        │
│  Public discovery enabled.                                       │
└──────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌──────────────────────────────────────────────────────────────────┐
│  7. SEAL                                                         │
│  university_admin → triggers seal → scheduled job snapshots all │
│  graduates into archive/{snapshotId}; writes are blocked.        │
└──────────────────────────────────────────────────────────────────┘
```

### 8.3 Permission matrix (abbreviated)

| Action | Visitor | Student (self) | Student (other) | Rep | Uni Admin | Superadmin |
|---|---|---|---|---|---|---|
| View public profile fields | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View private fields | ❌ | ✅ | only if approved | only their scope | ✅ | ✅ |
| Edit own profile (pre-seal) | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Approve goodwill | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Bulk import roster | ❌ | ❌ | ❌ | ✅ (scope) | ✅ | ✅ |
| Seal class | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## 9. Frontend Implementation

### 9.1 Route map (Next.js App Router)

```
/                              → Landing (marketing, animated hero)
/universities                  → Browse universities
/universities/[uniSlug]        → University home + classes
/universities/[uniSlug]/[year] → Class yearbook (grid)
/g/[graduateId]                → Graduate profile (premium detail page)
/search                        → Global search (people, schools)
/sign-in, /sign-up, /claim/[token]
/dashboard                     → Student/rep dashboard (auth)
/dashboard/profile
/dashboard/memories
/dashboard/goodwills
/admin                         → Uni admin & superadmin (auth + role)
```

### 9.2 Key UI surfaces (with feel)

- **Landing:** full-bleed hero with parallax cap-and-gown video, scroll-snapped feature sections, Lottie illustrations of "memory cards" stacking.
- **University home:** branded header, animated counter (graduates, classes), masonry of class covers.
- **Class yearbook:** mosaic grid of portraits with hover lift + name reveal; sticky filter rail (school/department/keyword).
- **Graduate profile:** magazine-style spread — large portrait, pull quote in serif, scroll-driven reveal of memories, floating goodwill action.
- **Dashboard:** clean, calm, productivity-app aesthetic; live previews of the public page beside the editor.

### 9.3 Component library
Build on top of Radix primitives. Compose into a `packages/ui` design system:

```
Button · IconButton · Avatar · Portrait · Tag
Field (RHF + Zod) · Toggle · Select · Combobox
Card · Modal · Sheet · Drawer · Tabs · Accordion
Toast · Banner · Skeleton · EmptyState
PageHeader · SectionDivider · QuoteBlock
```

Tokens via CSS variables: `--cl-ink`, `--cl-paper`, `--cl-accent`, `--cl-serif`, `--cl-sans`, plus per-university branding overrides.

---

## 10. Animation & Interactivity System

### 10.1 Layered approach

| Layer | Purpose | Tool |
|---|---|---|
| **Page transitions** | Fade + crossfade between routes | Framer Motion `<AnimatePresence>` |
| **Component entrance** | Reveal-on-scroll, staggered grids | Framer Motion `whileInView` |
| **Scroll-driven** | Parallax hero, pinned sections | GSAP ScrollTrigger + Lenis |
| **Micro-interactions** | Hover lift, press squish, focus glow | Tailwind + Framer `motion` |
| **Storytelling illustrations** | Hand-drawn cap, scroll, signature | Lottie (After Effects → Bodymovin JSON) |
| **Cinematic moments** | Class "reveal" on yearbook open | GSAP timeline + Canvas confetti |

### 10.2 Performance rules
- Animate **transform** & **opacity** only.
- Respect `prefers-reduced-motion`: provide a reduced variant for every animation.
- Lazy-load Lottie JSON; render static fallback first.
- GSAP imports tree-shaken; Framer Motion is `motion()` rather than `<motion.*>` where size matters.

### 10.3 Signature interactions
- **Open yearbook:** book-cover flip on first visit per class; afterwards skipped.
- **Portrait grid:** intersection-observer staggered fade with `y: 16 → 0`.
- **Goodwill send:** ribbon Lottie tying around message card.
- **Seal moment:** wax-stamp animation with subtle haptic on supported devices.

---

## 11. Responsive & Mobile-First Strategy

### 11.1 Breakpoints (mobile-first)

| Token | px | Use |
|---|---|---|
| `xs` | 360 | Baseline phone |
| `sm` | 480 | Large phone |
| `md` | 768 | Tablet portrait |
| `lg` | 1024 | Tablet landscape / small laptop |
| `xl` | 1280 | Laptop / desktop |
| `2xl` | 1536 | Large desktop |

### 11.2 Rules
- Build & QA at 360 first; only then scale up.
- Tap targets ≥ 44×44 px. Forms single-column on mobile.
- Bottom-sheet patterns instead of modals on mobile.
- Critical above-the-fold weight budget: **≤ 90 KB gzip JS**, **≤ 60 KB CSS**, hero image ≤ 80 KB AVIF.
- Test on real Android (Chrome) plus Safari iOS — do not rely only on emulators.

---

## 12. Backend Implementation (Cloud Functions)

### 12.1 Function inventory

| Name | Type | Trigger | Purpose |
|---|---|---|---|
| `nextServer` | HTTPS | All non-API routes | Serves Next.js SSR. |
| `api` | HTTPS | `/api/**` | REST/RPC entry for mutations. |
| `onUserCreate` | Auth | user create | Bootstraps `users/{uid}`. |
| `onPortraitUpload` | Storage | finalize | Generates AVIF/WebP variants + blurhash. |
| `onShowcaseUpload` | Storage | finalize | Hands off to Mux for transcode. |
| `onMuxWebhook` | HTTPS | external | Stores playback IDs, posters. |
| `onGoodwillCreate` | Firestore | create | Notifies graduate, queues moderation. |
| `onApprovalChange` | Firestore | write | Updates visibility flags atomically. |
| `searchSync` | Firestore | write | Pushes denormalised docs to Algolia/Typesense. |
| `sealClass` | Callable | manual | Snapshots & locks a class — admin-only. |
| `dailyDigest` | Scheduler | 06:00 daily | Emails reps pending-review summary. |
| `weeklyAnalytics` | Scheduler | weekly | Aggregates view counts. |

### 12.2 Coding standards
- All callables wrap in a Zod parse → typed handler.
- Idempotent writes (event id stored to avoid double-processing).
- Structured logs (`logger.info({ event, uid, classId })`).
- All long jobs (sealing) use Cloud Tasks or Firestore-backed work queue, not synchronous HTTP.

---

## 13. Security Rules

### 13.1 Firestore (excerpt)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {

    function isSignedIn() { return request.auth != null; }
    function role(r)       { return request.auth.token.roles[r] == true; }
    function isOwner(uid)  { return isSignedIn() && request.auth.uid == uid; }

    match /universities/{uniId} {
      allow read: if true;
      allow write: if role('superadmin') || role('university_admin');

      match /classes/{classId}/graduates/{gradId} {
        allow read: if resource.data.status in ['approved','sealed']
                    || isOwner(resource.data.uid)
                    || role('rep') || role('university_admin') || role('superadmin');

        // public-vs-private field redaction is enforced server-side via API.
        allow update: if (isOwner(resource.data.uid)
                          && resource.data.status != 'sealed')
                      || role('rep') || role('university_admin') || role('superadmin');

        allow create: if role('rep') || role('university_admin') || role('superadmin');
        allow delete: if role('university_admin') || role('superadmin');
      }
    }

    match /users/{uid} {
      allow read, write: if isOwner(uid) || role('superadmin');
    }
  }
}
```

> **Important:** Field-level privacy (visibility per field) is enforced by the **API layer**, not rules — rules are coarse, API is fine-grained. All public reads should go through SSR/API endpoints that strip private fields.

### 13.2 Storage rules
- Originals: write only by owner / rep; read only by signed URL via API.
- Variants (AVIF/WebP): public-read.
- Mux/external playback IDs are non-sensitive and embeddable.

---

## 14. Authentication & Onboarding

- **Methods:** Email + Password, Google OAuth, Phone OTP.
- **Email verification** required before profile editing.
- **Invite tokens:** signed JWT (HS256) with `inviteId`, `universityId`, `role`, `exp` — verified by Cloud Function before claim.
- **Account claim flow:** rep imports CSV → student receives email with `/claim/[token]` → student authenticates → backend links `users/{uid}` ↔ `graduates/{graduateId}`.
- **Custom claims:** assigned by `setRole` callable (superadmin only). Client must `auth.currentUser.getIdToken(true)` to refresh after a role change.

---

## 15. Media Pipeline (Photos & Videos)

### 15.1 Photos

```
Upload → Storage finalize trigger
       → sharp:
           · auto-rotate (EXIF)
           · strip EXIF GPS
           · resize: 320 / 640 / 1024 / 1600
           · encode: AVIF (q60) + WebP (q70) fallback
           · blurhash 4×3
       → write variants to /portrait/{size}.{fmt}
       → update graduate doc with paths + blurhash
```

### 15.2 Videos (showcase clips)

```
Upload to Storage → Function uploads passthrough to Mux
                  → Mux webhook fires when ready
                  → store playbackId, posterUrl, durationSec, captionsUrl
                  → Player uses Mux HLS w/ adaptive bitrate
```

Captions auto-generated via Mux; reviewed by rep before publish.

### 15.3 Limits
- Portrait: 10 MB max, JPEG/PNG/HEIC.
- Showcase clip: 60 s max, 200 MB max, MP4/MOV.
- Goodwill audio: 30 s, MP3/M4A.

---

## 16. Search, Indexing & Discovery

- **Primary index:** `graduates` records — `fullName`, `preferredName`, `universityName`, `schoolName`, `departmentName`, `classYear`, `status`.
- **Engine:** Algolia (fastest delivery) or Typesense (cheaper, self-hosted on Cloud Run).
- **Sync:** `searchSync` Firestore trigger writes denormalised, redacted docs (no private fields).
- **UI:** instant search with typo tolerance, keyboard navigation, "schools near me" facet.

---

## 17. Notifications & Messaging

- **Email (SendGrid):** invite, claim confirmation, profile-approved, goodwill received, weekly digest, seal complete.
- **Push (FCM):** new goodwill, profile approved, class sealed.
- **In-app inbox:** Firestore `users/{uid}/notifications` with `read: bool`.
- All transactional copy in `packages/shared-types/locales/en.json` (i18n-ready for FR / Hausa / Yoruba / Igbo later).

---

## 18. Privacy, Approvals & "Sealed Archive" Logic

### 18.1 Field-level visibility

Every PII field has a `visibility` value (`public | connections | private`). The public API serializer **redacts on output** based on viewer role + relationship.

```ts
function serializeGraduate(g: Graduate, viewer: Viewer): PublicGraduate {
  const out: any = { id: g.id, fullName: g.fullName, portrait: g.portrait };
  if (canSee(g.visibility.bio, g, viewer))      out.bio = g.bio;
  if (canSee(g.visibility.contact, g, viewer))  out.email = g.email;
  // ...
  return out;
}
```

### 18.2 Approvals
- Goodwills require either auto-approval (set by graduate) or manual approval before public display.
- Audit log every approval (`audit/{eventId}`) — append-only.

### 18.3 Sealing
A scheduled callable, callable only by `university_admin`:

```
sealClass(classId)
  1. Verify all profiles in 'approved' state.
  2. For each graduate: write immutable copy to /archive/{snapshotId}.
  3. Set classes/{classId}.status = 'sealed' and write sealedAt.
  4. Firestore rules block writes where status == 'sealed'.
  5. Storage variants are copied to a versioned cold path (Nearline).
  6. Issue a signed manifest (SHA-256 over each archive doc) → audit log.
```

---

## 19. CI/CD: GitHub → Firebase Hosting

### 19.1 Flow

```
 developer ──push──► GitHub ──► Actions
                                 │
                ┌────────────────┼─────────────────┐
                ▼                ▼                 ▼
            lint+typecheck   test (vitest)     build (turbo)
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │  PR?  → deploy preview channel │
                  │  main? → deploy live (prod)    │
                  │  staging? → deploy staging     │
                  └──────────────────────────────┘
```

### 19.2 `deploy-prod.yml` (sketch)

```yaml
name: Deploy Prod
on:
  push:
    branches: [ main ]
permissions:
  contents: read
  id-token: write              # for OIDC → GCP
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run lint typecheck test build
      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WIF }}
          service_account: deployer@campuslegacy-prod.iam.gserviceaccount.com
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SA_PROD }}
          projectId: campuslegacy-prod
          channelId: live
      - run: pnpm dlx firebase-tools deploy --only functions,firestore:rules,storage:rules --project campuslegacy-prod
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN_PROD }}
```

### 19.3 PR previews
Every PR opens a **Firebase Hosting preview channel** at `https://campuslegacy-prod--pr-<n>-<hash>.web.app` for 7 days. Comment is auto-posted to the PR.

### 19.4 Rollbacks
- Hosting: `firebase hosting:clone live:prev live:current` to restore.
- Functions: keep last 3 versions; redeploy by tag.
- Firestore rules: every deploy commits the rules file; revert by `git revert` + redeploy.

---

## 20. Environments, Branching & Release Strategy

- **Branches:** `main` (prod), `staging`, `feat/*`, `fix/*`.
- **Flow:** PR → `staging` for soak (24–48 h) → fast-forward to `main`.
- **Hot-fix:** `hotfix/*` from `main`, deploy directly to live, back-merge.
- **Versioning:** Conventional Commits + automated changelog.

---

## 21. Observability, Logging & Analytics

- **App perf:** Firebase Performance Monitoring (Web SDK).
- **Errors:** Sentry (web + functions) with release tagging from Git SHA.
- **Logs:** Cloud Logging structured logs.
- **Product analytics:** PostHog or GA4 (consent-gated).
- **Dashboards:** Looker Studio sourced from BigQuery (Firestore export).

---

## 22. Performance & SEO

- **Targets:** LCP ≤ 2.5 s on 4G, INP ≤ 200 ms, CLS ≤ 0.05.
- ISR for university and class pages (revalidate 1 h).
- `next/image` everywhere; AVIF preferred.
- HTTP/2 + Brotli via Firebase CDN.
- `<link rel="preload">` for the hero font (variable, subset to Latin + Naija extended).
- Per-graduate Open Graph cards generated by `@vercel/og` on demand and cached in Storage.
- `sitemap.xml` and structured data (`Person`, `EducationalOrganization`).

---

## 23. Accessibility (a11y)

- Target WCAG 2.2 AA.
- Semantic HTML; landmarks; visible focus rings (custom, on-brand).
- Colour contrast ≥ 4.5:1 for text.
- All animations gated by `prefers-reduced-motion`.
- Captions for showcase videos, transcripts for audio goodwills.
- Keyboard nav for grid (arrow keys move portrait selection).
- Tested with axe-core in CI and manually with NVDA + VoiceOver.

---

## 24. Testing Strategy

| Layer | Tool | What |
|---|---|---|
| Unit | Vitest | Pure functions, Zod schemas, redactor. |
| Component | React Testing Library | Components with state and a11y. |
| Integration | Firebase Emulator Suite + Vitest | Functions + rules. |
| E2E | Playwright | Sign-up → claim → profile build → approve. |
| Visual | Chromatic / Percy | Snapshot of premium pages across breakpoints. |
| Rules | `@firebase/rules-unit-testing` | Permission matrix. |
| Load | k6 | Search and class page under burst. |

CI must be green before merge. Coverage threshold: 80% for `functions/`, 70% for `apps/web/`.

---

## 25. Cost & Scalability Notes

- Firestore: design avoids hot-spotting (sharded counters for view counts).
- Storage: lifecycle rule moves `archive/**` to **Nearline** after 30 days.
- Cloud Functions: min instances = 1 for `nextServer` and `api` to avoid cold starts on production.
- Mux: pay per minute streamed — capped at 60 s clips controls spend.
- Estimated steady-state for 5,000 graduates / month of activity: **< US$120/mo** in infra excluding Mux.

---

## 26. Roadmap & Delivery Phases

```
Phase 0 — Foundations (Weeks 1–2)
   ├─ Repo, monorepo, CI, Firebase projects, domains, design tokens
   └─ Auth flows, base layout, marketing landing

Phase 1 — Core Yearbook (Weeks 3–6)
   ├─ University / class / graduate models + rules
   ├─ Portrait pipeline + grid + profile page
   ├─ Search MVP (Typesense)
   └─ Rep CSV import

Phase 2 — Memories & Goodwills (Weeks 7–9)
   ├─ Memories editor, goodwill flow + moderation
   └─ Showcase clips via Mux

Phase 3 — Premium Polish (Weeks 10–12)
   ├─ Animation system (page, scroll, micro)
   ├─ a11y audit, perf budget enforcement
   └─ OG image generation, sitemap, SEO

Phase 4 — Sealing & Archive (Weeks 13–14)
   ├─ Seal job, audit log, signed manifest
   └─ Cold-storage variant copy

Phase 5 — Pilot Launch (Weeks 15–16)
   ├─ One pilot university, two classes
   └─ Feedback loop, analytics dashboards
```

---

## 27. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Privacy leak (private fields) | Med | High | Server-side redactor + integration tests + bug bounty. |
| Slow networks degrade UX | High | Med | Mobile-first budgets, AVIF, skeletons, ISR. |
| Vendor lock-in (Firebase) | Med | Med | Keep functions thin; data exportable to BigQuery; modelled to be portable to Postgres if needed. |
| Mux costs spike | Med | Med | 60 s clip cap, monthly soft quota alert. |
| Rep mis-uploads roster | High | Med | Two-step CSV preview + diff before commit. |
| Disputed memories / goodwills | Med | Med | Take-down workflow, immutable audit log. |

---

## 28. Appendix

### 28.1 Naming conventions
- `kebab-case` for routes & files; `PascalCase` for React components; `camelCase` for variables.
- Firestore collection names plural; doc ids ULIDs unless natural key (e.g., classId = year string).

### 28.2 Definition of Done (per feature)
- ✅ Type-checked, lint-clean.
- ✅ Unit + at least one integration test.
- ✅ Mobile (360px) & desktop visuals approved in Chromatic.
- ✅ a11y: passes axe with no serious/critical issues.
- ✅ Perf: no regression beyond budget (Lighthouse CI).
- ✅ Docs updated (README + relevant section here).

### 28.3 Pre-launch checklist
- [ ] Custom domain SSL active.
- [ ] DPA / privacy policy / terms published.
- [ ] Cookie & analytics consent banner.
- [ ] Backup: daily Firestore export to BigQuery + GCS.
- [ ] Incident runbook in `/docs/runbooks/`.
- [ ] On-call rotation set in PagerDuty / OpsGenie.
- [ ] Penetration test report on file.
- [ ] Pilot university sign-off.

---

### Final note

CampusLegacy's product promise — *a trusted archive of identity, achievement, friendship, and legacy* — only holds if the engineering keeps three commitments visible in every commit:

1. **Privacy is not a feature, it is a default.**
2. **The mobile experience is the experience.**
3. **The archive, once sealed, is sacred.**

Build to those, and the rest follows.
