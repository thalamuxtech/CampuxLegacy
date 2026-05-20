'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, Filter } from 'lucide-react';
import type { Graduate } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function GraduatesManager({ initial }: { initial: Graduate[] }) {
  const [q, setQ] = useState('');
  const [year, setYear] = useState<number | null>(null);
  const [uni, setUni] = useState<string | null>(null);
  const [status, setStatus] = useState<Graduate['status'] | 'all'>('all');

  const years = useMemo(
    () => Array.from(new Set(initial.map((g) => g.year))).sort((a, b) => b - a),
    [initial]
  );
  const universities = useMemo(
    () =>
      Array.from(
        new Map(initial.map((g) => [g.universityId, g.universityName])).entries()
      ),
    [initial]
  );

  const filtered = useMemo(() => {
    return initial.filter((g) => {
      if (year && g.year !== year) return false;
      if (uni && g.universityId !== uni) return false;
      if (status !== 'all' && g.status !== status) return false;
      if (q) {
        const n = q.toLowerCase();
        if (
          !g.fullName.toLowerCase().includes(n) &&
          !g.departmentName.toLowerCase().includes(n)
        )
          return false;
      }
      return true;
    });
  }, [initial, q, year, uni, status]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-white border border-ink/10 p-4 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-ink-500">
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filters</span>
          </div>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Name or department"
            className="flex-1 min-w-[220px] max-w-sm h-10"
          />
          <select
            value={year ?? ''}
            onChange={(e) => setYear(e.target.value ? +e.target.value : null)}
            className="h-10 rounded-2xl border border-ink/15 bg-paper px-3 text-sm"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={uni ?? ''}
            onChange={(e) => setUni(e.target.value || null)}
            className="h-10 rounded-2xl border border-ink/15 bg-paper px-3 text-sm"
          >
            <option value="">All universities</option>
            {universities.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="h-10 rounded-2xl border border-ink/15 bg-paper px-3 text-sm"
          >
            <option value="all">Any status</option>
            <option value="draft">Draft</option>
            <option value="pending_review">Pending review</option>
            <option value="approved">Approved</option>
            <option value="sealed">Sealed</option>
          </select>
          <span className="ml-auto text-sm text-ink-500">
            {filtered.length} of {initial.length}
          </span>
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-ink/10 overflow-hidden shadow-soft">
        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1.5fr_120px_120px_60px] gap-4 px-5 py-3 text-[11px] uppercase tracking-widest text-ink-400 bg-ink/[0.02] border-b border-ink/5">
          <span>Graduate</span>
          <span>Department</span>
          <span>University</span>
          <span>Year</span>
          <span>Status</span>
          <span></span>
        </div>
        <ul className="divide-y divide-ink/5 max-h-[60vh] overflow-auto">
          {filtered.slice(0, 200).map((g, i) => (
            <motion.li
              key={g.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i, 20) * 0.01 }}
              className="px-5 py-3 hover:bg-ink/[0.02] transition-colors md:grid md:grid-cols-[2fr_1.5fr_1.5fr_120px_120px_60px] md:gap-4 md:items-center"
            >
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-xl overflow-hidden bg-ink/5">
                  <Image
                    src={g.portraitUrl}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{g.fullName}</p>
                  <p className="text-xs text-ink-500 truncate">{g.id}</p>
                </div>
              </div>
              <span className="text-sm text-ink-700 truncate">
                {g.departmentName}
              </span>
              <span className="text-sm text-ink-700 truncate">
                {g.universityName}
              </span>
              <span className="text-sm">{g.year}</span>
              <Badge
                variant={
                  g.status === 'sealed'
                    ? 'sealed'
                    : g.status === 'approved'
                    ? 'accent'
                    : 'outline'
                }
              >
                {g.status}
              </Badge>
              <Link
                href={`/g/${g.id}`}
                target="_blank"
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 hover:bg-ink/10"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
