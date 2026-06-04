'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Italic accent word that draws an underline beneath itself when scrolled in.
 * The underline is a 1.5px gradient line in the accent color.
 *
 * Usage:
 *   <h1>Preserving the <AccentReveal>story</AccentReveal> of every class.</h1>
 */
export function AccentReveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={`relative inline-block italic text-accent ${className ?? ''}`}>
      {children}
      <motion.span
        aria-hidden
        initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'left' }}
        className="absolute left-0 right-0 -bottom-1 sm:-bottom-1.5 h-[2px] bg-gradient-to-r from-accent via-accent to-ochre rounded-full"
      />
    </span>
  );
}
