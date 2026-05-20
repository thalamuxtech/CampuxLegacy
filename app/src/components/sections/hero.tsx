'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoGraduates } from '@/lib/demo-data';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.08, duration: 0.7, ease: 'easeOut' },
  }),
};

export function Hero() {
  const portraits = demoGraduates.slice(0, 12);

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 pb-24 sm:pb-32">
      {/* Decorative background */}
      <div className="absolute inset-0 -z-10 bg-radial-fade" />
      <div className="absolute inset-0 -z-10 bg-grain opacity-40" />

      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
            >
              <Badge variant="accent">
                <Sparkles className="h-3 w-3" />
                Premium digital yearbook · Africa
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="serif mt-6 text-5xl xs:text-6xl sm:text-7xl lg:text-[88px] leading-[0.95] tracking-tight"
            >
              Preserving the{' '}
              <span className="italic text-accent">story</span> of every
              graduating class.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-6 text-lg sm:text-xl text-ink-600 max-w-xl"
            >
              Portraits. Memories. Goodwill messages. Sealed forever as a
              trusted digital legacy for students and the universities that
              shaped them.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Button asChild size="lg" variant="default">
                <Link href="/universities">
                  Browse universities <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/for-schools">Onboard your school</Link>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="mt-12 flex items-center gap-6 text-sm text-ink-500"
            >
              <div className="flex -space-x-2">
                {portraits.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="h-9 w-9 rounded-full ring-2 ring-paper overflow-hidden bg-ink/5"
                  >
                    <Image
                      src={p.portraitUrl}
                      alt=""
                      width={36}
                      height={36}
                      className="object-cover h-full w-full"
                    />
                  </div>
                ))}
              </div>
              <p>
                <span className="font-semibold text-ink">46,000+</span>{' '}
                graduates already preserving their legacy.
              </p>
            </motion.div>
          </div>

          {/* Portrait collage */}
          <div className="lg:col-span-5">
            <PortraitCollage portraits={portraits} />
          </div>
        </div>
      </div>
    </section>
  );
}

function PortraitCollage({ portraits }: { portraits: typeof demoGraduates }) {
  return (
    <div className="relative aspect-[5/6] w-full max-w-[520px] mx-auto">
      {portraits.slice(0, 9).map((p, i) => {
        const cols = 3;
        const x = i % cols;
        const y = Math.floor(i / cols);
        const offset = (x + y) % 2 === 0 ? -10 : 10;
        return (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 24, rotate: 0 }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: ((x - 1) * 1.5 + (y - 1) * -1) * 1,
            }}
            transition={{
              delay: 0.2 + i * 0.07,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ y: -6, scale: 1.04, zIndex: 10 }}
            className="absolute"
            style={{
              left: `${(x / cols) * 100}%`,
              top: `${(y / 3) * 100}%`,
              width: `${100 / cols + 4}%`,
              height: `${100 / 3 + 4}%`,
              transform: `translateY(${offset}px)`,
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-ink/10 ring-1 ring-ink/10 shadow-[0_24px_40px_-24px_rgba(11,11,15,0.35)]">
              <Image
                src={p.portraitUrl}
                alt={p.fullName}
                fill
                sizes="200px"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-ink/80 to-transparent">
                <p className="text-[10px] text-paper/90 truncate">
                  {p.fullName}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
      {/* Floating accent card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: -6 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute -bottom-6 -left-6 max-w-[200px] rounded-2xl bg-paper p-4 shadow-2xl ring-1 ring-ink/10"
      >
        <p className="text-[10px] uppercase tracking-widest text-ink-400">
          Sealed legacy
        </p>
        <p className="serif text-lg mt-1 leading-tight">
          “From late nights to convocation.”
        </p>
      </motion.div>
    </div>
  );
}
