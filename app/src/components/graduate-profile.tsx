'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { toast } from 'sonner';
import { Instagram, Linkedin, Heart, Quote, Send } from 'lucide-react';
import type { Graduate } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

export function GraduateProfile({ graduate: g }: { graduate: Graduate }) {
  return (
    <article className="pb-24">
      {/* Magazine spread */}
      <section className="container mt-8">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink/5 ring-1 ring-ink/10 shadow-[0_40px_60px_-30px_rgba(11,11,15,0.4)]">
              <Image
                src={g.portraitUrl}
                alt={g.fullName}
                fill
                priority
                sizes="(min-width:1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            {g.status === 'sealed' && (
              <div className="mt-4 flex justify-center">
                <Badge variant="sealed">Sealed in archive · {g.sealedAt}</Badge>
              </div>
            )}
          </motion.div>

          {/* Header */}
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-xs uppercase tracking-[0.25em] text-accent-700"
            >
              {g.departmentName} · {g.schoolName}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="serif text-6xl sm:text-7xl mt-4 leading-[0.95]"
            >
              {g.fullName}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="mt-4 text-ink-600"
            >
              {g.universityName} · Class of {g.year}
            </motion.p>

            {g.quote && (
              <motion.blockquote
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative mt-10 pl-8"
              >
                <Quote className="absolute left-0 top-0 h-6 w-6 text-accent" />
                <p className="serif text-3xl sm:text-4xl italic leading-snug">
                  "{g.quote}"
                </p>
              </motion.blockquote>
            )}

            {g.bio && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-10 text-ink-700 dropcap leading-relaxed text-lg max-w-prose"
              >
                {g.bio}
              </motion.p>
            )}

            {g.socials && (
              <div className="mt-8 flex gap-3">
                {g.socials.instagram && (
                  <a
                    href={`https://instagram.com/${g.socials.instagram}`}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 hover:border-ink/40 hover:bg-ink/5"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {g.socials.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${g.socials.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 hover:border-ink/40 hover:bg-ink/5"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Memories */}
      <section className="container mt-24">
        <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
          Memories
        </p>
        <h2 className="serif text-4xl mt-2">Moments that defined the journey.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {g.memories.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className="rounded-3xl border border-ink/10 bg-white p-7 hover:border-ink/25 transition-colors"
            >
              <p className="text-xs uppercase tracking-widest text-ink-400">
                {new Date(m.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                })}
              </p>
              <p className="serif text-2xl mt-2">{m.title}</p>
              <p className="mt-3 text-ink-700 leading-relaxed">{m.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Goodwills */}
      <section className="container mt-24">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
              Goodwill messages
            </p>
            <h2 className="serif text-4xl mt-2">From those who walked alongside.</h2>
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {g.goodwills.filter((gw) => gw.approved).map((gw, i) => (
            <motion.div
              key={gw.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-3xl bg-gradient-to-br from-accent-50 to-paper border border-accent/20 p-7"
            >
              <Heart className="h-5 w-5 text-accent" />
              <p className="mt-4 text-ink-700 leading-relaxed">"{gw.message}"</p>
              <div className="hairline my-5" />
              <p className="text-sm">
                <b>{gw.fromName}</b>{' '}
                <span className="text-ink-500">· {gw.fromRelation}</span>
              </p>
            </motion.div>
          ))}
        </div>

        <GoodwillForm graduateId={g.id} />
      </section>
    </article>
  );
}

function GoodwillForm({ graduateId }: { graduateId: string }) {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (message.length < 8) {
      toast.error('Add a few more words to your message.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/goodwills', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          graduateId,
          fromName: name,
          fromRelation: relation,
          message,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Goodwill sent — pending approval. 💛');
      setName('');
      setRelation('');
      setMessage('');
    } catch {
      toast.error('Could not send. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-12 rounded-3xl bg-ink text-paper p-7 sm:p-10"
    >
      <p className="serif text-2xl">Leave a goodwill message</p>
      <p className="mt-2 text-paper/70 text-sm">
        Messages are reviewed before being shown publicly.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Input
          required
          minLength={2}
          maxLength={60}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="bg-paper/10 border-paper/15 text-paper placeholder:text-paper/50"
        />
        <Input
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder="Relationship (e.g. classmate)"
          className="bg-paper/10 border-paper/15 text-paper placeholder:text-paper/50"
        />
      </div>
      <Textarea
        required
        minLength={8}
        maxLength={400}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write something they'll keep forever…"
        className="mt-3 bg-paper/10 border-paper/15 text-paper placeholder:text-paper/50"
      />
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-paper/60">
          {message.length}/400
        </span>
        <Button type="submit" variant="accent" disabled={submitting}>
          <Send className="h-4 w-4" />
          {submitting ? 'Sending…' : 'Send goodwill'}
        </Button>
      </div>
    </motion.form>
  );
}
