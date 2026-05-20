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
} from 'firebase/auth';
import { firebaseConfigured, getFirebase } from './firebase';

type AuthState = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthState | null>(null);

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
        await signInWithEmailAndPassword(fb.auth, email, password);
      },
      signUp: async (email, password) => {
        const fb = getFirebase();
        if (!fb) throw new Error('Firebase not configured');
        await createUserWithEmailAndPassword(fb.auth, email, password);
      },
      signInWithGoogle: async () => {
        const fb = getFirebase();
        if (!fb) throw new Error('Firebase not configured');
        await signInWithPopup(fb.auth, new GoogleAuthProvider());
      },
      signOut: async () => {
        const fb = getFirebase();
        if (!fb) return;
        await fbSignOut(fb.auth);
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
