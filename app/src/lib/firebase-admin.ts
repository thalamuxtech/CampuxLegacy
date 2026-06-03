import 'server-only';
import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';

let app: App | null = null;
let initFailed = false;

/**
 * Returns the Firebase Admin SDK handles, or null if no credentials are
 * available (demo mode).
 *
 * Credential sources, in order:
 *   1. Explicit env vars (FIREBASE_ADMIN_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY) — local dev.
 *   2. Application Default Credentials — when running inside a Firebase
 *      Cloud Function / App Hosting / Cloud Run / any GCP runtime. The SDK
 *      picks up the function's runtime service account automatically.
 */
export function getAdmin(): {
  app: App;
  auth: Auth;
  db: Firestore;
  storage: Storage;
} | null {
  if (app) {
    return {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
      storage: getStorage(app),
    };
  }
  if (initFailed) return null;

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.GCLOUD_PROJECT ||
    process.env.GOOGLE_CLOUD_PROJECT;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    '\n'
  );
  const hasExplicit = projectId && clientEmail && privateKey;
  const hasADC = Boolean(
    process.env.K_SERVICE || // Cloud Run / Cloud Functions Gen 2
      process.env.FUNCTION_TARGET || // Cloud Functions Gen 1
      process.env.GOOGLE_APPLICATION_CREDENTIALS // local with creds file
  );

  if (!hasExplicit && !hasADC) return null;

  try {
    const existing = getApps()[0];
    if (existing) {
      app = existing;
    } else if (hasExplicit) {
      app = initializeApp({
        credential: cert({
          projectId: projectId!,
          clientEmail: clientEmail!,
          privateKey: privateKey!,
        }),
        storageBucket: `${projectId}.firebasestorage.app`,
      });
    } else {
      app = initializeApp({
        ...(projectId ? { projectId } : {}),
        ...(projectId ? { storageBucket: `${projectId}.firebasestorage.app` } : {}),
      });
    }
    return {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
      storage: getStorage(app),
    };
  } catch (err) {
    initFailed = true;
    // eslint-disable-next-line no-console
    console.error('[firebase-admin] init failed:', err);
    return null;
  }
}
