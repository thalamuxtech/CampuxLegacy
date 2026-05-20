'use client';

import { motion } from 'framer-motion';

export function UniversityBars({
  data,
}: {
  data: { id: string; name: string; graduates: number; classes: number }[];
}) {
  const max = Math.max(...data.map((d) => d.graduates), 1);
  return (
    <ul className="space-y-4">
      {data.map((u, i) => {
        const pct = (u.graduates / max) * 100;
        return (
          <li key={u.id}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="truncate pr-3">{u.name}</span>
              <span className="text-ink-500">{u.graduates}</span>
            </div>
            <div className="h-2 rounded-full bg-ink/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-300"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
