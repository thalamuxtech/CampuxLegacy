'use client';

import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  /** Format the running value. Default: integer with thousands separator. */
  format?: (value: number) => string;
  /** Duration in seconds (advisory — spring decides). Default 2. */
  duration?: number;
  className?: string;
  /** Suffix appended after the number (e.g. "+", "k"). */
  suffix?: string;
  /** Prefix prepended (e.g. "$"). */
  prefix?: string;
}

const defaultFormat = (v: number) =>
  Math.round(v).toLocaleString('en-US');

/**
 * Counts from 0 → `to` when scrolled into view, once. Springs to feel
 * natural rather than linear. Respects prefers-reduced-motion (renders final
 * value immediately).
 */
export function CountUp({
  to,
  format = defaultFormat,
  duration = 2,
  className,
  suffix,
  prefix,
}: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const mv = useMotionValue(0);
  const spring = useSpring(mv, {
    duration: duration * 1000,
    bounce: 0,
  });
  const display = useTransform(spring, (v) =>
    `${prefix ?? ''}${format(v)}${suffix ?? ''}`
  );

  useEffect(() => {
    if (reduce) {
      mv.set(to);
      return;
    }
    if (inView) mv.set(to);
  }, [inView, to, mv, reduce]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
