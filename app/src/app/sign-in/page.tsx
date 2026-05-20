'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { SiteNav } from '@/components/site-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { authErrorMessage } from '@/lib/auth-errors';

export default function SignInPage() {
  const { signIn, signInWithGoogle, resetPassword, configured } = useAuth();
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) {
      toast.info('Demo mode: redirecting to dashboard.');
      router.push(next);
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      router.push(next);
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function onForgot() {
    if (!email) {
      toast.error('Enter your email above first.');
      return;
    }
    if (!configured) {
      toast.info('Demo mode: password reset would be sent.');
      return;
    }
    setResetting(true);
    try {
      await resetPassword(email);
      toast.success(`Reset link sent to ${email}.`);
    } catch (err) {
      toast.error(authErrorMessage(err));
    } finally {
      setResetting(false);
    }
  }

  return (
    <>
      <SiteNav />
      <main className="min-h-dvh grid place-items-center pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto px-6"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
            Welcome back
          </p>
          <h1 className="serif text-4xl mt-2">Sign in to your legacy.</h1>

          <form onSubmit={onSubmit} className="mt-10 space-y-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@university.edu"
              autoComplete="email"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Password"
              autoComplete="current-password"
            />
            <div className="flex items-center justify-between text-xs text-ink-500">
              <button
                type="button"
                onClick={onForgot}
                disabled={resetting}
                className="underline underline-offset-4 hover:text-ink disabled:opacity-50"
              >
                {resetting ? 'Sending…' : 'Forgot password?'}
              </button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Continue'}
            </Button>
          </form>
          <div className="my-6 flex items-center gap-3 text-xs text-ink-400">
            <div className="hairline flex-1" />
            <span>or</span>
            <div className="hairline flex-1" />
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={async () => {
              if (!configured) {
                toast.info('Demo mode: redirecting.');
                router.push(next);
                return;
              }
              try {
                await signInWithGoogle();
                router.push(next);
              } catch (err) {
                toast.error(authErrorMessage(err));
              }
            }}
          >
            Continue with Google
          </Button>
          <p className="mt-8 text-sm text-ink-500 text-center">
            New here?{' '}
            <Link
              href="/sign-up"
              className="underline underline-offset-4 hover:text-ink"
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </main>
    </>
  );
}
