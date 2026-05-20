'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { SiteNav } from '@/components/site-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';

export default function SignUpPage() {
  const { signUp, configured } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) {
      toast.info('Demo mode: account simulated.');
      router.push('/dashboard');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password);
      router.push('/dashboard');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
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
            Start your legacy
          </p>
          <h1 className="serif text-4xl mt-2">Claim your graduating profile.</h1>
          <form onSubmit={onSubmit} className="mt-10 space-y-3">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
            />
            <Input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create account'}
            </Button>
          </form>
        </motion.div>
      </main>
    </>
  );
}
