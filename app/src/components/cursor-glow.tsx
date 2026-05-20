'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { damping: 30, stiffness: 200, mass: 0.4 });
  const sy = useSpring(y, { damping: 30, stiffness: 200, mass: 0.4 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <motion.div
      aria-hidden
      style={{
        x: sx,
        y: sy,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[340px] w-[340px] rounded-full opacity-50 mix-blend-multiply"
    >
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(184,133,74,0.22)_0%,transparent_60%)]" />
    </motion.div>
  );
}
