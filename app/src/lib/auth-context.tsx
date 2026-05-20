'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { firebaseConfigured, getFirebase } from './firebase';

type AuthState = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

async function exchangeIdTokenForSessionCookie(user: User): Promise<void> {
  try {
    const idToken = await user.getIdToken();
    await fetch('/api/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
  } catch {
    /* session cookie is best-effort; client SDK still has the session */
  }
}

async function clearSessionCookie(): Promise<void> {
  try {
    await fetch('/api/session', { method: 'DELETE' });
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fb = getFirebase();
    if (!fb) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(fb.auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      configured: firebaseConfigured,
      signIn: async (email, password) => {
        const fb = getFirebase();
        if (!fb) throw new Error('Firebase not configured');
        const cred = await signInWithEmailAndPassword(fb.auth, email, password);
        await exchangeIdTokenForSessionCookie(cred.user);
      },
      signUp: async (email, password, displayName) => {
        const fb = getFirebase();
        if (!fb) throw new Error('Firebase not configured');
        const cred = await createUserWithEmailAndPassword(fb.auth, email, password);
        if (displayName) {
          await updateProfile(cred.user, { displayName });
        }
        await exchangeIdTokenForSessionCookie(cred.user);
      },
      signInWithGoogle: async () => {
        const fb = getFirebase();
        if (!fb) throw new Error('Firebase not configured');
        const cred = await signInWithPopup(fb.auth, new GoogleAuthProvider());
        await exchangeIdTokenForSessionCookie(cred.user);
      },
      signOut: async () => {
        const fb = getFirebase();
        await clearSessionCookie();
        if (!fb) return;
        await fbSignOut(fb.auth);
      },
      resetPassword: async (email) => {
        const fb = getFirebase();
        if (!fb) throw new Error('Firebase not configured');
        await sendPasswordResetEmail(fb.auth, email);
      },
    }),
    [user, loading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
