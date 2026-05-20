# Going live — 5-step checklist

Steps to do in order. Each takes ~2 minutes.

---

## 1. Connect Firebase App Hosting

This deploys the web app and re-deploys on every push to `main`.

1. Open <https://console.firebase.google.com/project/campuxlegacy/apphosting>
2. Click **Get started** (or **Create backend** if you already have one)
3. **Connect to GitHub** → authorise → pick `thalamuxtech/CampuxLegacy`
4. Settings:
   - **Branch:** `main`
   - **Root directory:** `app`
   - **Region:** any (closest to your users — `europe-west1` is fine)
   - **Backend ID:** `campuxlegacy` (or whatever)
5. Click **Finish & deploy**

The first build will take ~3–4 minutes. Watch it in the App Hosting → Builds tab.

---

## 2. Add the three Admin SDK secrets

App Hosting needs these to verify session cookies and run server-side admin operations. They’re referenced by name in [`app/apphosting.yaml`](app/apphosting.yaml).

You’ll need the values from `planning/campuxlegacy-firebase-adminsdk-fbsvc-18ada4e625.json`.

1. Open your App Hosting backend → **Settings → Secrets**
2. Click **Add secret** three times:

   | Secret name | Value (from JSON) |
   |---|---|
   | `firebase-admin-project-id` | `campuxlegacy` |
   | `firebase-admin-client-email` | the `client_email` field (looks like `firebase-adminsdk-fbsvc@campuxlegacy.iam.gserviceaccount.com`) |
   | `firebase-admin-private-key` | the full `private_key` field, **including** `-----BEGIN PRIVATE KEY-----` and the trailing newline. Paste it as one block; App Hosting handles the `\n`. |

3. After saving, click **Redeploy** so the build picks up the new secrets.

---

## 3. Enable Auth providers

1. Open <https://console.firebase.google.com/project/campuxlegacy/authentication/providers>
2. **Email/Password** → toggle **Enable** → **Save**
3. **Google** → toggle **Enable**:
   - Set **Project public-facing name** to `CampuxLegacy`
   - Set **Project support email** to `thalamuxtech@gmail.com`
   - **Save**

Optionally add other providers (Apple, Microsoft) later.

---

## 4. Bootstrap the first superadmin

This grants you full admin powers so you can use `/admin/roles` to mint more roles for others.

1. Visit your deployed site (or `localhost:3000` if you haven’t deployed yet)
2. Go to **/sign-up** and create your account with your real email
3. From the repo root, run:

   ```bash
   node scripts/grant-superadmin.mjs your-email@example.com
   ```

   You should see:
   ```
   OK. your-email@example.com (uid) is now superadmin.
   Custom claims: { "roles": { "student": true, "superadmin": true } }
   ```

4. **Sign out and back in** on the site — the new claim only loads on a fresh ID token.
5. Visit `/admin` — you should see the console.

After this, you never need the script again. Use `/admin/roles` to grant `university_admin`, `rep`, etc. to others.

---

## 5. Verify the CI workflow

The GitHub Actions workflow deploys Functions + Firestore rules + Storage rules + indexes.

It already ran on the foundation commit. Check status:

```bash
gh run list --repo thalamuxtech/CampuxLegacy --workflow deploy-prod.yml --limit 3
```

If a run is **failed**, open it on github.com to see the log:

```bash
gh run view --repo thalamuxtech/CampuxLegacy --log-failed
```

Common first-run failure: the workflow only triggers when `app/functions/**` or rules change. The initial push didn’t touch those, so it may not have run yet. Force it manually:

```bash
gh workflow run deploy-prod.yml --repo thalamuxtech/CampuxLegacy
gh run watch --repo thalamuxtech/CampuxLegacy
```

---

## You’re live

After all five steps:
- Public site at the App Hosting URL (or `campuxlegacy.app` once you connect a custom domain in App Hosting → Settings → Domains)
- `/admin` accessible to you as superadmin
- Functions, rules, and indexes deployed via CI on every push to `main`
- Sign-ups create real user docs; the `onUserCreate` trigger seeds them automatically
- Portrait uploads write through Cloud Functions to generate AVIF + WebP variants
