'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, KeyRound } from 'lucide-react';
import { SplitText } from '@/components/motion/split-text';
import { AccentReveal } from '@/components/motion/accent-reveal';

const EASE = [0.16, 1, 0.3, 1] as const;

export function PrivacyBlock() {
  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 mesh-bg opacity-60" />
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium">
              · Privacy by design
            </p>
            <h2 className="serif text-4xl sm:text-5xl lg:text-6xl mt-4 leading-[1.05]">
              <SplitText text="Public by name. " />
              <AccentReveal>Private</AccentReveal>
              <SplitText text=" by default." whileInView={false} />
            </h2>
            <p className="mt-7 text-ink/70 text-lg max-w-lg leading-relaxed">
              Registered users may view basic public details such as a
              graduate's name and portrait. More personal information —
              emails, private memories, profile content — is only visible
              when approved by the individual.
            </p>
            <ul className="mt-10 space-y-3">
              {[
                { icon: Eye, title: 'Public', body: 'name, portrait, university, class.' },
                { icon: EyeOff, title: 'Private', body: 'email, phone, detailed bio — gated by approval.' },
                { icon: KeyRound, title: 'Approvals', body: 'per-field control. Toggle anytime before seal.' },
                { icon: Shield, title: 'Sealed', body: 'once a class is sealed, content becomes immutable.' },
              ].map((item, i) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }}
                  className="flex items-start gap-3 glass-card rounded-2xl px-4 py-3"
                >
                  <item.icon className="h-5 w-5 mt-0.5 text-accent shrink-0" />
                  <span className="text-sm leading-relaxed">
                    <b className="font-semibold">{item.title}:</b>{' '}
                    <span className="text-ink/75">{item.body}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Animated lock illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-100 to-paper" />
            <motion.div
              animate={{ rotate: [0, 6, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-10 rounded-full border border-accent/30"
            />
            <motion.div
              animate={{ rotate: [0, -8, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-20 rounded-full border border-accent/20"
            />
            <motion.div
              animate={{ rotate: [0, 4, 0] }}
              transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-32 rounded-full border border-ochre/20"
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="grid h-32 w-32 place-items-center rounded-full bg-ink text-paper shadow-2xl"
                >
                  <Shield className="h-12 w-12 text-accent" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                  className="absolute -bottom-3 -right-3 grid h-12 w-12 place-items-center rounded-full bg-accent text-paper shadow-accent-glow"
                >
                  <KeyRound className="h-5 w-5" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
