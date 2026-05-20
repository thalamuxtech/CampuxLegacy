'use client';

import { motion } from 'framer-motion';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
            {eyebrow}
          </p>
        )}
        <h1 className="serif text-3xl sm:text-4xl mt-1.5 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-sm text-ink-500 max-w-xl">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </motion.div>
  );
}
