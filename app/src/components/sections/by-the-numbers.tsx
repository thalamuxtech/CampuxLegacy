'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Camera, ClipboardCheck, ShieldCheck, Archive } from 'lucide-react';
import { CountUp } from '@/components/motion/count-up';

const EASE = [0.16, 1, 0.3, 1] as const;

const stats = [
  { value: 46640, suffix: '+', label: 'Graduates preserved' },
  { value: 21, label: 'Classes sealed' },
  { value: 4, label: 'Universities live' },
  { value: 3, label: 'Countries represented' },
];

const flow = [
  { icon: Camera, label: 'Capture', sub: 'Portrait + memories' },
  { icon: ClipboardCheck, label: 'Review', sub: 'Graduate approves' },
  { icon: ShieldCheck, label: 'Seal', sub: 'SHA-256 manifest' },
  { icon: Archive, label: 'Archive', sub: 'Forever' },
];

export function ByTheNumbers() {
  const reduce = useReducedMotion();
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div aria-hidden className="absolute inset-0 mesh-bg opacity-50" />
      <div aria-hidden className="absolute inset-0 bg-grain opacity-30" />

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-2xl"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium">
            · By the numbers
          </p>
          <h2 className="serif text-4xl sm:text-5xl lg:text-6xl mt-4 leading-[1.05]">
            A growing archive of African excellence.
          </h2>
        </motion.div>

        {/* Stat counters */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.08, duration: 0.8, ease: EASE }}
              className="glass-card rounded-3xl p-7"
            >
              <div className="serif text-5xl sm:text-6xl text-ink leading-none tracking-tight tabular-nums">
                <CountUp to={s.value} duration={2.2} suffix={s.suffix} />
              </div>
              <div className="hairline mt-5 mb-4" />
              <p className="text-xs uppercase tracking-[0.18em] text-ink/60 font-medium">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Animated seal flowchart */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
          className="mt-16 glass-card rounded-3xl p-8 sm:p-10"
        >
          <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
            <p className="text-xs uppercase tracking-[0.22em] text-accent font-medium">
              · How a class is sealed
            </p>
            <p className="text-xs text-ink/55">
              Tamper-evident · SHA-256 manifest
            </p>
          </div>

          <div className="relative">
            {/* The connecting line, animated draw */}
            <motion.div
              aria-hidden
              initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 2, delay: 0.4, ease: EASE }}
              style={{ transformOrigin: 'left' }}
              className="hidden sm:block absolute top-7 left-[6%] right-[6%] h-[2px] bg-gradient-to-r from-accent/0 via-accent/60 to-ochre/0 rounded-full -z-0"
            />

            <ol className="relative grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4">
              {flow.map((step, i) => (
                <motion.li
                  key={step.label}
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{
                    delay: 0.6 + i * 0.18,
                    duration: 0.7,
                    ease: EASE,
                  }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-paper ring-1 ring-ink/10 shadow-editorial">
                    <step.icon className="h-6 w-6 text-accent" strokeWidth={1.5} />
                    {/* Pulse aura for the last step (seal) */}
                    {i === flow.length - 1 && !reduce && (
                      <motion.div
                        aria-hidden
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 1.4, opacity: 0 }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: 'easeOut',
                          delay: 1.4,
                        }}
                        className="absolute inset-0 rounded-2xl bg-accent/30"
                      />
                    )}
                  </div>
                  <p className="serif text-lg mt-4">{step.label}</p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-ink/55 mt-1">
                    {step.sub}
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
