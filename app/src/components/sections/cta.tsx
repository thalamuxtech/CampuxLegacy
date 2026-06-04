'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { SplitText } from '@/components/motion/split-text';

const EASE = [0.16, 1, 0.3, 1] as const;

export function CTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="relative overflow-hidden rounded-[2rem] bg-ink text-paper px-8 py-16 sm:px-16 sm:py-24 text-center"
        >
          {/* Mesh wash */}
          <div aria-hidden className="absolute inset-0 mesh-dark" />
          {/* Slow drift layer */}
          <motion.div
            aria-hidden
            animate={{ x: ['-2%', '2%', '-2%'] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 mesh-dark opacity-50"
          />
          <div aria-hidden className="absolute inset-0 bg-grain opacity-15" />

          <div className="relative">
            <p className="text-xs uppercase tracking-[0.22em] text-accent-300 font-medium">
              · The legacy starts now
            </p>
            <h2 className="serif text-4xl sm:text-6xl lg:text-7xl mt-5 max-w-3xl mx-auto leading-[1.02]">
              <SplitText text="Your graduation, sealed " />
              <span className="relative inline-block italic text-accent-300">
                beautifully
              </span>
              <SplitText text=" for life." whileInView={false} />
            </h2>
            <p className="mt-7 text-paper/70 text-lg max-w-xl mx-auto leading-relaxed">
              Bring your university on board, or claim your own graduating
              profile today. It takes minutes.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="accent" className="group shadow-accent-glow">
                <Link href="/for-schools">
                  Onboard your school
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-editorial group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-paper/30 bg-transparent text-paper hover:bg-paper/10 hover:border-paper/50"
              >
                <Link href="/sign-up">Claim your profile</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
