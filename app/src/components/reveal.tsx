'use client';

import { motion, type MotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

export function Reveal({
  children,
  delay = 0,
  y = 16,
  as: As = 'div',
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: keyof typeof motion;
} & MotionProps) {
  const Comp = motion[As] as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
