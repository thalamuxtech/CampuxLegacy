'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function ForSchoolsPage() {
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSubmitting(false);
    if (res.ok) {
      toast.success('Onboarding request received — we will be in touch.');
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error('Could not submit. Try again.');
    }
  }

  return (
    <>
      <SiteNav />
      <main className="pt-28 sm:pt-36">
        <section className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
                For institutions
              </p>
              <h1 className="serif text-5xl sm:text-7xl mt-3 leading-[0.95]">
                Bring your university on board.
              </h1>
              <p className="mt-6 text-ink-600 text-lg max-w-lg">
                We'll align on scope, branding and access level, then provision
                your university's digital yearbook portal — usually within a
                week.
              </p>
              <ul className="mt-10 space-y-4">
                {[
                  'White-glove onboarding for your team',
                  'Custom branding (crest, colours, motto)',
                  'Roster import + per-school representatives',
                  'Sealed archive guarantee for every class',
                ].map((b) => (
                  <motion.li
                    key={b}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 text-ink-700"
                  >
                    <CheckCircle2 className="h-5 w-5 mt-0.5 text-accent" />
                    {b}
                  </motion.li>
                ))}
              </ul>
            </div>

            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-ink/10 bg-white p-7 sm:p-10"
            >
              <p className="serif text-2xl">Request onboarding</p>
              <p className="text-sm text-ink-500 mt-1">
                We'll review and respond within 2 business days.
              </p>
              <div className="mt-6 space-y-3">
                <Input
                  name="fullName"
                  placeholder="Your full name"
                  required
                  minLength={2}
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Work email"
                  required
                />
                <Input
                  name="universityName"
                  placeholder="University name"
                  required
                />
                <Input
                  name="role"
                  placeholder="Your role / title"
                  required
                />
                <Input name="phone" placeholder="Phone (optional)" />
                <Textarea
                  name="notes"
                  placeholder="Tell us about your graduating class…"
                />
                <Button
                  type="submit"
                  variant="accent"
                  className="w-full"
                  size="lg"
                  disabled={submitting}
                >
                  {submitting ? 'Sending…' : 'Submit request'}
                </Button>
              </div>
            </motion.form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
