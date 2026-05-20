'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-[2rem] bg-ink text-paper px-8 py-16 sm:px-16 sm:py-24 text-center"
        >
          <div className="absolute inset-0 bg-radial-fade opacity-60" />
          <div className="absolute inset-0 bg-grain opacity-15" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.2em] text-accent">
              The legacy starts now
            </p>
            <h2 className="serif text-4xl sm:text-6xl mt-4 max-w-3xl mx-auto leading-tight">
              Your graduation, sealed beautifully for life.
            </h2>
            <p className="mt-6 text-paper/70 text-lg max-w-xl mx-auto">
              Bring your university on board, or claim your own graduating
              profile today. It takes minutes.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/for-schools">
                  Onboard your school <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-paper/30 bg-transparent text-paper hover:bg-paper/10">
                <Link href="/sign-up">Claim your profile</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
