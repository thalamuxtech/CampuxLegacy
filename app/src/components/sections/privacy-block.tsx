'use client';

import { motion } from 'framer-motion';
import { Eye, EyeOff, Shield, KeyRound } from 'lucide-react';

export function PrivacyBlock() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
              Privacy by design
            </p>
            <h2 className="serif text-4xl sm:text-5xl mt-3">
              Public by name. Private by default.
            </h2>
            <p className="mt-6 text-ink-600 text-lg max-w-lg">
              Registered users may view basic public details such as a
              graduate's name and portrait. More personal information —
              emails, private memories, profile content — is only visible
              when approved by the individual.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Eye className="h-5 w-5 mt-0.5 text-accent" />
                <span><b>Public:</b> name, portrait, university, class.</span>
              </li>
              <li className="flex items-start gap-3">
                <EyeOff className="h-5 w-5 mt-0.5 text-accent" />
                <span><b>Private:</b> email, phone, detailed bio — gated by approval.</span>
              </li>
              <li className="flex items-start gap-3">
                <KeyRound className="h-5 w-5 mt-0.5 text-accent" />
                <span><b>Approvals:</b> per-field control. Toggle anytime before seal.</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 mt-0.5 text-accent" />
                <span><b>Sealed:</b> once a class is sealed, content becomes immutable.</span>
              </li>
            </ul>
          </div>

          {/* Animated lock illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-100 to-paper" />
            <motion.div
              animate={{ rotate: [0, 6, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-10 rounded-full border border-accent/30"
            />
            <motion.div
              animate={{ rotate: [0, -8, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-20 rounded-full border border-accent/20"
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="relative">
                <div className="grid h-32 w-32 place-items-center rounded-full bg-ink text-paper shadow-2xl">
                  <Shield className="h-12 w-12 text-accent" />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute -bottom-3 -right-3 grid h-12 w-12 place-items-center rounded-full bg-accent text-white shadow-lg"
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
