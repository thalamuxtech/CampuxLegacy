'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Camera, Film, Quote, Users, Heart, ShieldCheck } from 'lucide-react';
import { demoGraduates } from '@/lib/demo-data';

const EASE = [0.16, 1, 0.3, 1] as const;

const features = [
  { icon: Camera, label: 'Portrait photographs' },
  { icon: Users, label: 'Personal profiles' },
  { icon: Film, label: 'Showcase clips' },
  { icon: Quote, label: 'Written memories' },
  { icon: Heart, label: 'Goodwill messages' },
  { icon: ShieldCheck, label: 'Privacy-controlled' },
];

export function FeatureShowcase() {
  const sample = demoGraduates[3];
  return (
    <section className="relative py-24 sm:py-32 bg-ink text-paper overflow-hidden">
      {/* Mesh on dark — terracotta + ochre wash */}
      <div aria-hidden className="absolute inset-0 mesh-dark" />
      <div aria-hidden className="absolute inset-0 bg-grain opacity-10" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-accent-300 font-medium">
              · More than a yearbook
            </p>
            <h2 className="serif text-4xl sm:text-5xl lg:text-6xl mt-4 leading-[1.05]">
              A memory and{' '}
              <span className="italic text-accent-300">identity</span> platform.
            </h2>
            <p className="mt-7 text-paper/70 text-lg max-w-lg leading-relaxed">
              Capture the people, moments and experiences that defined the
              university journey — in a format that lasts as long as the
              memories deserve to.
            </p>

            <ul className="mt-10 grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <motion.li
                  key={f.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.6, ease: EASE }}
                  className="flex items-center gap-3 glass-dark rounded-2xl px-3 py-2.5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-paper/[0.06] ring-1 ring-paper/10">
                    <f.icon className="h-4 w-4 text-accent-300" />
                  </span>
                  <span className="text-sm text-paper/90">{f.label}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Stylised profile mock-up */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: EASE }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden bg-paper text-ink shadow-2xl ring-1 ring-paper/20">
              <div className="relative aspect-[4/5]">
                <Image
                  src={sample.portraitUrl}
                  alt={sample.fullName}
                  fill
                  sizes="(min-width:1024px) 480px, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/0 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-paper">
                  <p className="text-[11px] uppercase tracking-[0.2em] opacity-85">
                    {sample.departmentName} · Class of {sample.year}
                  </p>
                  <p className="serif text-3xl mt-1.5">{sample.fullName}</p>
                </div>
              </div>
              <div className="p-6 bg-paper-50">
                <p className="serif text-xl italic leading-snug text-ink/85">
                  “{sample.quote}”
                </p>
                <div className="hairline my-6" />
                <p className="text-sm text-ink/65">
                  Sealed in the {sample.universityName} archive.
                </p>
              </div>
            </div>
            {/* Floating ochre accent badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -4 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
              className="absolute -top-4 -right-4 rounded-full bg-ochre text-ink px-4 py-2 shadow-glass ring-1 ring-ink/10"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold">
                Class · {sample.year}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
