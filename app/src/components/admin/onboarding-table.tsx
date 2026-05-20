'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Eye, Mail, Phone, Building2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Item = {
  id: string;
  fullName: string;
  email: string;
  universityName: string;
  role: string;
  phone?: string;
  notes?: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  createdAt: string;
};

const statusFilters = ['all', 'pending', 'in_review', 'approved', 'rejected'] as const;

export function OnboardingTable({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<(typeof statusFilters)[number]>('all');
  const [selected, setSelected] = useState<Item | null>(null);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (filter !== 'all' && i.status !== filter) return false;
      if (!q) return true;
      const n = q.toLowerCase();
      return (
        i.fullName.toLowerCase().includes(n) ||
        i.universityName.toLowerCase().includes(n) ||
        i.email.toLowerCase().includes(n)
      );
    });
  }, [items, q, filter]);

  async function setStatus(id: string, status: Item['status']) {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
    try {
      await fetch(`/api/admin/onboarding/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      toast.success(`Marked as ${status.replace('_', ' ')}`);
    } catch {
      toast.error('Could not update — try again.');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, university or email…"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f
                  ? 'bg-ink text-paper'
                  : 'bg-white text-ink-600 border border-ink/10 hover:border-ink/30'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-white border border-ink/10 overflow-hidden shadow-soft">
        <div className="hidden md:grid grid-cols-[1.5fr_1fr_1fr_120px_120px] gap-4 px-5 py-3 text-[11px] uppercase tracking-widest text-ink-400 bg-ink/[0.02] border-b border-ink/5">
          <span>Requester</span>
          <span>University</span>
          <span>Role</span>
          <span>Status</span>
          <span>Action</span>
        </div>
        <ul className="divide-y divide-ink/5">
          <AnimatePresence initial={false}>
            {filtered.map((i) => (
              <motion.li
                key={i.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="px-5 py-4 hover:bg-ink/[0.02] transition-colors"
              >
                <div className="md:grid md:grid-cols-[1.5fr_1fr_1fr_120px_120px] md:gap-4 md:items-center flex flex-col gap-2">
                  <div>
                    <p className="font-medium">{i.fullName}</p>
                    <p className="text-xs text-ink-500">{i.email}</p>
                  </div>
                  <p className="text-sm text-ink-700">{i.universityName}</p>
                  <p className="text-sm text-ink-700">{i.role}</p>
                  <div>
                    <StatusPill status={i.status} />
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setSelected(i)}
                      className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-3 py-1.5 text-xs hover:bg-ink/10"
                    >
                      <Eye className="h-3 w-3" /> View
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <li className="p-10 text-center text-ink-500 text-sm">No requests match.</li>
          )}
        </ul>
      </div>

      <AnimatePresence>
        {selected && (
          <DetailDrawer
            item={selected}
            onClose={() => setSelected(null)}
            onStatus={(s) => {
              setStatus(selected.id, s);
              setSelected({ ...selected, status: s });
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusPill({ status }: { status: Item['status'] }) {
  if (status === 'approved')
    return <Badge variant="accent">Approved</Badge>;
  if (status === 'rejected')
    return (
      <Badge className="bg-rose/10 text-rose border border-rose/30">
        Rejected
      </Badge>
    );
  if (status === 'in_review')
    return <Badge variant="outline">In review</Badge>;
  return (
    <Badge className="bg-sage/15 text-sage border border-sage/30">
      Pending
    </Badge>
  );
}

function DetailDrawer({
  item,
  onClose,
  onStatus,
}: {
  item: Item;
  onClose: () => void;
  onStatus: (s: Item['status']) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: 600 }}
        animate={{ x: 0 }}
        exit={{ x: 600 }}
        transition={{ type: 'spring', stiffness: 200, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-paper p-7 overflow-y-auto"
      >
        <p className="text-xs uppercase tracking-widest text-accent-700">
          Request detail
        </p>
        <h2 className="serif text-3xl mt-1">{item.fullName}</h2>
        <p className="mt-1 text-sm text-ink-500">{item.role}</p>
        <StatusPill status={item.status} />

        <div className="mt-6 space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-ink-400" /> {item.universityName}
          </p>
          <a
            href={`mailto:${item.email}`}
            className="flex items-center gap-2 hover:underline"
          >
            <Mail className="h-4 w-4 text-ink-400" /> {item.email}
          </a>
          {item.phone && (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-ink-400" /> {item.phone}
            </p>
          )}
        </div>

        {item.notes && (
          <>
            <div className="hairline my-6" />
            <p className="text-xs uppercase tracking-widest text-ink-400 mb-2">
              Notes
            </p>
            <p className="text-sm leading-relaxed text-ink-700">{item.notes}</p>
          </>
        )}

        <div className="hairline my-6" />
        <p className="text-xs uppercase tracking-widest text-ink-400 mb-2">
          Update status
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => onStatus('in_review')}
            className="justify-center"
          >
            <ArrowRight className="h-4 w-4" /> In review
          </Button>
          <Button
            variant="accent"
            onClick={() => onStatus('approved')}
            className="justify-center"
          >
            <CheckCircle2 className="h-4 w-4" /> Approve
          </Button>
          <Button
            variant="ghost"
            onClick={() => onStatus('pending')}
            className="justify-center"
          >
            Set pending
          </Button>
          <Button
            variant="ghost"
            onClick={() => onStatus('rejected')}
            className="justify-center text-rose hover:bg-rose/10"
          >
            <XCircle className="h-4 w-4" /> Reject
          </Button>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-full border border-ink/15 py-2.5 text-sm hover:bg-ink/5"
        >
          Close
        </button>
      </motion.aside>
    </motion.div>
  );
}
