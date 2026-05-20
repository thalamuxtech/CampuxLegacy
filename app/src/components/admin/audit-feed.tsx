'use client';

import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export function AuditFeed({
  data,
}: {
  data: { id: string; type: string; actor: string; detail: string; at: string }[];
}) {
  return (
    <ul className="relative space-y-4">
      <span className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-paper/10" />
      {data.map((a, i) => (
        <motion.li
          key={a.id}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="relative pl-8"
        >
          <span className="absolute left-0 top-1 grid h-6 w-6 place-items-center rounded-full bg-accent text-white">
            <ShieldCheck className="h-3 w-3" />
          </span>
          <p className="text-xs text-paper/60">
            {new Date(a.at).toLocaleString()}
          </p>
          <p className="text-sm mt-0.5">
            <span className="font-semibold">{a.type}</span>{' '}
            <span className="text-paper/60">by {a.actor}</span>
          </p>
          <p className="text-sm text-paper/80 mt-0.5">{a.detail}</p>
        </motion.li>
      ))}
    </ul>
  );
}
