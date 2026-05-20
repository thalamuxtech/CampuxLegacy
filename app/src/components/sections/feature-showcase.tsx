'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Camera, Film, Quote, Users, Heart, ShieldCheck } from 'lucide-react';
import { demoGraduates } from '@/lib/demo-data';

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
    <section className="py-24 sm:py-32 bg-ink text-paper relative overflow-hidden">
      <div className="absolute inset-0 bg-grain opacity-10" />
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent">
              More than a yearbook
            </p>
            <h2 className="serif text-4xl sm:text-5xl mt-3">
              A memory and identity platform.
            </h2>
            <p className="mt-6 text-paper/70 text-lg max-w-lg">
              Capture the people, moments and experiences that defined the
              university journey — in a format that lasts as long as the
              memories deserve to.
            </p>

            <ul className="mt-10 grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.li
                  key={f.label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-paper/10 ring-1 ring-paper/15">
                    <f.icon className="h-4 w-4 text-accent" />
                  </span>
                  <span className="text-sm text-paper/90">{f.label}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Stylised profile mock-up */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
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
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-paper">
                  <p className="text-xs uppercase tracking-widest opacity-80">
                    {sample.departmentName} · Class of {sample.year}
                  </p>
                  <p className="serif text-3xl mt-1">{sample.fullName}</p>
                </div>
              </div>
              <div className="p-6">
                <p className="serif text-xl italic leading-snug">
                  “{sample.quote}”
                </p>
                <div className="hairline my-6" />
                <p className="text-sm text-ink-600">
                  Sealed in the {sample.universityName} archive.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
