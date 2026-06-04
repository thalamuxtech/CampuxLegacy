'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoGraduates } from '@/lib/demo-data';
import { SplitText } from '@/components/motion/split-text';
import { AccentReveal } from '@/components/motion/accent-reveal';
import { CountUp } from '@/components/motion/count-up';

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.12 + i * 0.08, duration: 0.9, ease: EASE },
  }),
};

export function Hero() {
  const portraits = demoGraduates.slice(0, 12);

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 pb-24 sm:pb-32">
      {/* Editorial mesh + slow drift */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeOut' }}
        className="absolute inset-0 -z-10 mesh-bg"
      />
      <motion.div
        aria-hidden
        animate={{ x: ['0%', '-2%', '0%'], y: ['0%', '1%', '0%'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 -z-10 mesh-bg opacity-50"
      />
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

            <h1 className="display mt-7 text-5xl xs:text-6xl sm:text-7xl lg:text-[92px]">
              <SplitText
                text="Preserving the "
                whileInView={false}
                delay={0.25}
                stagger={0.06}
              />
              <AccentReveal>story</AccentReveal>
              <SplitText
                text=" of every graduating class."
                whileInView={false}
                delay={0.55}
                stagger={0.05}
              />
            </h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="mt-7 text-lg sm:text-xl text-ink/70 max-w-xl leading-relaxed"
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
              <Button asChild size="lg" variant="default" className="group">
                <Link href="/universities">
                  Browse universities
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover:translate-x-1" />
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
              className="mt-14 flex items-center gap-6 text-sm text-ink/60"
            >
              <div className="flex -space-x-2">
                {portraits.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="h-10 w-10 rounded-full ring-2 ring-paper overflow-hidden bg-ink/5 shadow-editorial"
                  >
                    <Image
                      src={p.portraitUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="object-cover h-full w-full"
                    />
                  </div>
                ))}
              </div>
              <p>
                <span className="font-semibold text-ink tabular-nums">
                  <CountUp to={46640} suffix="+" duration={2.4} />
                </span>{' '}
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
            initial={{ opacity: 0, y: 28, rotate: 0 }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: ((x - 1) * 1.5 + (y - 1) * -1) * 1,
            }}
            transition={{
              delay: 0.25 + i * 0.07,
              duration: 0.95,
              ease: EASE,
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
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-ink/10 ring-1 ring-ink/10 shadow-[0_24px_40px_-24px_rgba(28,20,16,0.35)]">
              <Image
                src={p.portraitUrl}
                alt={p.fullName}
                fill
                sizes="200px"
                className="object-cover transition-transform duration-1000 ease-editorial hover:scale-110"
              />
              <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-ink/80 to-transparent">
                <p className="text-[10px] text-paper/95 truncate font-medium">
                  {p.fullName}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
      {/* Floating accent quote card — now glass */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: -10 }}
        animate={{ opacity: 1, scale: 1, rotate: -5 }}
        transition={{ delay: 1.1, duration: 1, ease: EASE }}
        whileHover={{ rotate: -3, y: -4 }}
        className="absolute -bottom-6 -left-6 max-w-[220px] rounded-2xl glass-card p-5"
      >
        <p className="text-[10px] uppercase tracking-[0.18em] text-accent font-medium">
          Sealed legacy
        </p>
        <p className="serif text-xl mt-2 leading-snug">
          “From late nights to convocation.”
        </p>
      </motion.div>
    </div>
  );
}
