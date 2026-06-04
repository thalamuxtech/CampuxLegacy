'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Fragment } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

interface SplitTextProps {
  /** Plain text — splits on whitespace into word spans. */
  text: string;
  /** Optional className applied to the wrapper. */
  className?: string;
  /** Tag name. Defaults to span. */
  as?: 'span' | 'div' | 'p';
  /** Stagger between words. Default 0.05s. */
  stagger?: number;
  /** Initial delay before the first word. Default 0.1s. */
  delay?: number;
  /** Trigger on viewport entry (true) or on mount (false). Default true. */
  whileInView?: boolean;
}

/**
 * Word-by-word fade-up reveal. Respects prefers-reduced-motion (renders text
 * statically with no motion). Words wrap in inline-block spans so descenders
 * + selection still work naturally.
 */
export function SplitText({
  text,
  className,
  as = 'span',
  stagger = 0.05,
  delay = 0.1,
  whileInView = true,
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const Wrapper = as;
  const words = text.split(/(\s+)/); // keep spaces as separate tokens

  if (reduce) {
    return <Wrapper className={className}>{text}</Wrapper>;
  }

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
  const word = {
    hidden: { opacity: 0, y: '60%' },
    show: {
      opacity: 1,
      y: '0%',
      transition: { duration: 0.8, ease: EASE },
    },
  };

  const viewportProps = whileInView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-80px' } }
    : { initial: 'hidden', animate: 'show' };

  return (
    <Wrapper className={className}>
      <motion.span variants={container} {...viewportProps} className="inline">
        {words.map((w, i) =>
          /^\s+$/.test(w) ? (
            <Fragment key={i}>{w}</Fragment>
          ) : (
            <span
              key={i}
              className="inline-block overflow-hidden align-baseline"
              style={{ lineHeight: 'inherit' }}
            >
              <motion.span variants={word} className="inline-block">
                {w}
              </motion.span>
            </span>
          )
        )}
      </motion.span>
    </Wrapper>
  );
}

/**
 * Same as SplitText but for use INSIDE an existing motion element — does not
 * spawn its own viewport observer. Useful when wrapping a headline that's
 * already inside a motion.div.
 */
export function SplitTextInline({ text, className }: { text: string; className?: string }) {
  return <SplitText text={text} className={className} whileInView={false} />;
}
