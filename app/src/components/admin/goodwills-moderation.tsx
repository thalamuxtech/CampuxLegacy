'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Check, X, AlertTriangle, Heart, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Item = {
  id: string;
  graduateId: string;
  graduateName: string;
  fromName: string;
  fromRelation?: string;
  message: string;
  approved: boolean;
  flagged?: boolean;
  createdAt: string;
};

export function GoodwillsModeration({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<'all' | 'pending' | 'flagged' | 'approved'>(
    'pending'
  );

  const visible = useMemo(() => {
    return items.filter((i) => {
      if (filter === 'pending') return !i.approved && !i.flagged;
      if (filter === 'flagged') return i.flagged;
      if (filter === 'approved') return i.approved;
      return true;
    });
  }, [items, filter]);

  async function act(id: string, action: 'approve' | 'reject') {
    if (action === 'reject') {
      setItems((prev) => prev.filter((i) => i.id !== id));
    } else {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, approved: true, flagged: false } : i))
      );
    }
    try {
      await fetch(`/api/admin/goodwills/${id}`, {
        method: action === 'approve' ? 'PATCH' : 'DELETE',
      });
      toast.success(action === 'approve' ? 'Approved ✨' : 'Removed');
    } catch {
      toast.error('Could not update');
    }
  }

  const counts = {
    pending: items.filter((i) => !i.approved && !i.flagged).length,
    flagged: items.filter((i) => i.flagged).length,
    approved: items.filter((i) => i.approved).length,
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'pending', label: `Pending · ${counts.pending}` },
          { id: 'flagged', label: `Flagged · ${counts.flagged}` },
          { id: 'approved', label: `Approved · ${counts.approved}` },
          { id: 'all', label: 'All' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              filter === f.id
                ? 'bg-ink text-paper'
                : 'bg-white border border-ink/10 text-ink-700 hover:border-ink/30'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AnimatePresence initial={false}>
          {visible.map((g) => (
            <motion.div
              key={g.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`relative rounded-3xl p-6 shadow-soft border ${
                g.flagged
                  ? 'bg-rose/[0.04] border-rose/30'
                  : g.approved
                  ? 'bg-accent-50 border-accent/20'
                  : 'bg-white border-ink/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {g.flagged ? (
                    <AlertTriangle className="h-4 w-4 text-rose" />
                  ) : g.approved ? (
                    <Heart className="h-4 w-4 text-accent" />
                  ) : (
                    <Quote className="h-4 w-4 text-ink-400" />
                  )}
                  <span className="text-xs uppercase tracking-widest text-ink-500">
                    For {g.graduateName}
                  </span>
                </div>
                {g.flagged && <Badge className="bg-rose/10 text-rose">Flagged</Badge>}
              </div>

              <p className="serif text-xl mt-3 leading-snug">"{g.message}"</p>
              <p className="text-xs text-ink-500 mt-3">
                {g.fromName}
                {g.fromRelation ? ` · ${g.fromRelation}` : ''} ·{' '}
                {new Date(g.createdAt).toLocaleString()}
              </p>

              {!g.approved && (
                <div className="mt-5 flex gap-2">
                  <Button size="sm" variant="accent" onClick={() => act(g.id, 'approve')}>
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose hover:bg-rose/10"
                    onClick={() => act(g.id, 'reject')}
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <div className="md:col-span-2 rounded-3xl border border-dashed border-ink/15 p-12 text-center text-ink-500">
            Nothing here. Inbox zero. 🎉
          </div>
        )}
      </div>
    </div>
  );
}
