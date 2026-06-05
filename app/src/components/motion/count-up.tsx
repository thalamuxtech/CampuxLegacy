'use client';

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  /** Format the running value. Default: integer with thousands separator. */
  format?: (value: number) => string;
  /** Duration in seconds. Default 2. */
  duration?: number;
  className?: string;
  /** Suffix appended after the number (e.g. "+", "k"). */
  suffix?: string;
  /** Prefix prepended (e.g. "$"). */
  prefix?: string;
  /** Scroll threshold. 0 = trigger on mount (first viewport). Default 0. */
  rootMargin?: string;
}

const defaultFormat = (v: number) =>
  Math.round(v).toLocaleString('en-US');

/**
 * Counts from 0 → `to` when scrolled into view, once. Uses tween (animate())
 * with editorial easing — predictable duration, no spring degeneracy.
 * Respects prefers-reduced-motion.
 */
export function CountUp({
  to,
  format = defaultFormat,
  duration = 2,
  className,
  suffix,
  prefix,
  rootMargin = '0px',
}: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: rootMargin as `${number}px` });

  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) =>
    `${prefix ?? ''}${format(v)}${suffix ?? ''}`
  );

  useEffect(() => {
    if (reduce) {
      mv.set(to);
      return;
    }
    if (!inView) return;
    const controls = animate(mv, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, to, mv, reduce, duration]);

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
