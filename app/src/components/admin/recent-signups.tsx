'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Graduate } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

export function RecentSignups({ data }: { data: Graduate[] }) {
  return (
    <ul className="divide-y divide-ink/5">
      {data.map((g, i) => (
        <motion.li
          key={g.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-4 py-3 first:pt-0"
        >
          <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-ink/5">
            <Image src={g.portraitUrl} alt={g.fullName} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/g/${g.id}`}
              className="text-sm font-medium link-grow"
            >
              {g.fullName}
            </Link>
            <p className="text-xs text-ink-500 truncate">
              {g.departmentName} · {g.universityName}
            </p>
          </div>
          <div className="text-right">
            <Badge variant={g.status === 'sealed' ? 'sealed' : g.status === 'approved' ? 'accent' : 'outline'}>
              {g.status}
            </Badge>
            <p className="text-[10px] text-ink-400 mt-1">{g.year}</p>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}
