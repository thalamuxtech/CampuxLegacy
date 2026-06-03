# Deploy to Vercel (free Hobby tier)

This app runs as a Next.js 14 SSR app on Vercel, with Firebase (Spark / free plan) providing Auth, Firestore, and Storage. No Cloud Functions, no Blaze billing required.

Local production build is verified — `npm run build` completes cleanly with 31 routes.

---

## 1. Connect the repo to Vercel

1. Go to <https://vercel.com/new> and sign in with GitHub.
2. Import `thalamuxtech/CampuxLegacy`.
3. **Root Directory:** click *Edit* and set it to `app`. (Critical — the repo root is not the Next.js app.)
4. Framework Preset: **Next.js** (auto-detected).
5. Build & Output settings: leave defaults (`npm run build`, output `.next`).
6. Don't deploy yet — add env vars first (next step).

---

## 2. Add environment variables

In the *Environment Variables* section of the import screen (or **Project → Settings → Environment Variables** afterwards), add the following. Apply to **Production + Preview + Development** unless noted.

### Demo-mode-only deploy (no Firebase wiring yet)

Just one var, and the app will boot with seeded data:

```
NEXT_PUBLIC_DEMO_MODE=true
```

### Real Firebase wiring (recommended — uses your existing `campuxlegacy` project on Spark)

Get the **Web SDK config** from <https://console.firebase.google.com/project/campuxlegacy/settings/general> → *Your apps* → Web app → SDK setup → Config.

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=campuxlegacy.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=campuxlegacy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=campuxlegacy.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...   # optional
```

For the **admin SDK** (needed for `/admin/*`, session cookies, and `/api/*` admin routes), generate a service-account JSON:

1. <https://console.firebase.google.com/project/campuxlegacy/settings/serviceaccounts/adminsdk>
2. Click **Generate new private key** → download the JSON.
3. From that JSON, pull these three values into Vercel env vars:

```
FIREBASE_ADMIN_PROJECT_ID=campuxlegacy
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-...@campuxlegacy.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

**Important** for `FIREBASE_ADMIN_PRIVATE_KEY`: in Vercel's UI, paste the key with literal `\n` sequences (not real newlines). The code in `src/lib/firebase-admin.ts` replaces `\n` back to real newlines.

Don't set `NEXT_PUBLIC_DEMO_MODE=true` if you want real Firebase.

---

## 3. Enable Firebase Auth providers (free)

<https://console.firebase.google.com/project/campuxlegacy/authentication/providers>

- **Email/Password** → Enable.
- **Google** → Enable, support email = `info@haleyouthfoundation.org`.

---

## 4. Add your Vercel domain to Firebase Auth's allowed list

Once Vercel gives you the production URL (e.g. `campuxlegacy.vercel.app`), add it to **Firebase Console → Authentication → Settings → Authorized domains**. Sign-in won't work without this.

---

## 5. Deploy

Click **Deploy** in Vercel. First build takes ~2–3 min. After it succeeds, you'll get:

- Production: `https://campuxlegacy.vercel.app` (or whatever Vercel assigns if the name is taken)
- Preview per branch / PR: auto-generated URLs
- Auto-redeploys on every push to `main`

---

## 6. Deploy Firestore + Storage rules separately (one-time, free)

Vercel hosts the Next.js app, but Firestore/Storage rules still need to be pushed to Firebase. From your machine:

```bash
cd app
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules,firestore:indexes,storage:rules --project campuxlegacy
```

This works on Spark — only Hosting/Functions need Blaze.

---

## 7. Bootstrap the first superadmin

After signing up with `thalamuxtech@gmail.com` on the deployed site:

```bash
# from repo root, with GOOGLE_APPLICATION_CREDENTIALS pointing at the service-account JSON
node scripts/grant-superadmin.mjs
```

Sign out and back in to refresh the ID token, then visit `/admin`.

---

## What's different from `GO_LIVE.md`?

- No Blaze upgrade needed.
- No Cloud Functions deploy (Next.js runs on Vercel instead).
- The URL is `*.vercel.app`, not `campuxlegacy.web.app`. Add a custom domain in Vercel if you want a branded URL — it's free on Hobby.
- `GO_LIVE.md` is still accurate if you ever want to move back to the all-Firebase setup.
