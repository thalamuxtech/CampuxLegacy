'use client';

import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  Firestore,
  connectFirestoreEmulator,
  initializeFirestore,
} from 'firebase/firestore';
import {
  FirebaseStorage,
  connectStorageEmulator,
  getStorage,
} from 'firebase/storage';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseConfigured = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _storage: FirebaseStorage | null = null;

export function getFirebase() {
  if (!firebaseConfigured) return null;
  if (!app) {
    app = getApps()[0] ?? initializeApp(config as Record<string, string>);
    _auth = getAuth(app);
    _db = initializeFirestore(app, { ignoreUndefinedProperties: true });
    _storage = getStorage(app);

    if (
      typeof window !== 'undefined' &&
      process.env.NEXT_PUBLIC_USE_EMULATORS === 'true' &&
      !(window as unknown as { __cl_emu?: boolean }).__cl_emu
    ) {
      (window as unknown as { __cl_emu: boolean }).__cl_emu = true;
      try {
        connectAuthEmulator(_auth!, 'http://127.0.0.1:9099', {
          disableWarnings: true,
        });
        connectFirestoreEmulator(_db!, '127.0.0.1', 8080);
        connectStorageEmulator(_storage!, '127.0.0.1', 9199);
      } catch {
        /* already connected */
      }
    }
  }
  return { app: app!, auth: _auth!, db: _db!, storage: _storage! };
}
