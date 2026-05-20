'use client';

import { motion } from 'framer-motion';
import {
  GraduationCap,
  Lock,
  Inbox,
  HeartHandshake,
  Mail,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminStats({
  metrics,
}: {
  metrics: ReturnType<typeof import('@/lib/admin-store').adminMetrics>;
}) {
  const cards = [
    {
      label: 'Total graduates',
      value: metrics.totalGraduates.toLocaleString(),
      sub: `${metrics.sealedGraduates} sealed · ${metrics.liveGraduates} live`,
      icon: GraduationCap,
      accent: 'from-accent-200 to-accent-50',
      delta: '+12% MoM',
    },
    {
      label: 'Onboarding requests',
      value: metrics.pendingOnboarding + metrics.inReviewOnboarding,
      sub: `${metrics.pendingOnboarding} pending · ${metrics.inReviewOnboarding} in review`,
      icon: Inbox,
      accent: 'from-sage/20 to-paper',
      delta: 'Needs action',
      danger: metrics.pendingOnboarding > 0,
    },
    {
      label: 'Pending goodwills',
      value: metrics.pendingGoodwills,
      sub: `${metrics.flaggedGoodwills} flagged for review`,
      icon: HeartHandshake,
      accent: 'from-rose/20 to-paper',
      delta: metrics.flaggedGoodwills ? 'Review now' : 'All clear',
      danger: metrics.flaggedGoodwills > 0,
    },
    {
      label: 'Inbox',
      value: metrics.unreadContacts,
      sub: 'Unread contact messages',
      icon: Mail,
      accent: 'from-ink-100 to-paper',
      delta: 'Updated live',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.5 }}
          className={cn(
            'relative overflow-hidden rounded-3xl border border-ink/10 bg-white p-5 shadow-soft'
          )}
        >
          <div
            className={cn(
              'absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-70',
              c.accent
            )}
          />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink/5">
                <c.icon className="h-4 w-4 text-ink" />
              </span>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                  c.danger
                    ? 'bg-rose/15 text-rose'
                    : 'bg-ink/5 text-ink-600'
                )}
              >
                <TrendingUp className="h-3 w-3" />
                {c.delta}
              </span>
            </div>
            <p className="mt-5 text-xs uppercase tracking-widest text-ink-400">
              {c.label}
            </p>
            <p className="serif text-4xl mt-1 leading-none">{c.value}</p>
            <p className="mt-3 text-xs text-ink-500">{c.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Avoid an unused import warning
void Lock;
