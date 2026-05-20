'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSending(false);
    if (res.ok) {
      toast.success('Message sent — we usually reply within a day.');
      (e.target as HTMLFormElement).reset();
    } else toast.error('Could not send. Try again.');
  }

  return (
    <>
      <SiteNav />
      <main className="pt-28 sm:pt-36">
        <section className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
                Get in touch
              </p>
              <h1 className="serif text-5xl sm:text-7xl mt-3 leading-[0.95]">
                Tell us about your archive.
              </h1>
              <p className="mt-6 text-ink-600 text-lg max-w-lg">
                Universities, alumni associations, press, students — we read
                everything. Usually reply within one working day.
              </p>
              <div className="mt-10 space-y-4">
                {[
                  { icon: Mail, label: 'thalamuxtech@gmail.com' },
                  { icon: MessageCircle, label: 'WhatsApp +234 800 555 0144' },
                  { icon: MapPin, label: 'Lagos, Nigeria · serving all of Africa' },
                ].map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink/5">
                      <row.icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-ink-700">{row.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-ink/10 bg-white p-7 sm:p-10 shadow-soft"
            >
              <p className="serif text-2xl">Send a message</p>
              <div className="mt-6 space-y-3">
                <Input name="name" required minLength={2} placeholder="Your name" />
                <Input name="email" type="email" required placeholder="Your email" />
                <Input name="subject" required placeholder="Subject" />
                <Textarea
                  name="message"
                  required
                  minLength={8}
                  placeholder="Write a few details…"
                />
                <Button
                  type="submit"
                  size="lg"
                  variant="accent"
                  disabled={sending}
                  className="w-full"
                >
                  {sending ? 'Sending…' : 'Send message'}
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
