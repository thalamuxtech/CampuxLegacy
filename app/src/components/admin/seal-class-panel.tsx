'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Lock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Item = {
  id: string;
  year: number;
  universityId: string;
  universityName: string;
  status: string;
  graduatesCount: number;
};

export function SealClassPanel({ classes }: { classes: Item[] }) {
  const [selected, setSelected] = useState<Item | null>(null);
  const [confirm, setConfirm] = useState('');
  const [sealing, setSealing] = useState(false);
  const [manifest, setManifest] = useState<string | null>(null);

  async function doSeal() {
    if (!selected || confirm !== 'SEAL') return;
    setSealing(true);
    try {
      const res = await fetch('/api/admin/seal', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ classId: selected.id }),
      });
      const data = await res.json();
      setManifest(data.manifest);
      toast.success('Class sealed. The archive is forever.');
    } catch {
      toast.error('Seal failed.');
    } finally {
      setSealing(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-3xl bg-white border border-ink/10 p-6 shadow-soft">
        <p className="text-xs uppercase tracking-widest text-ink-400 mb-4">
          Choose a class to seal
        </p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {classes
            .filter((c) => c.status !== 'sealed')
            .map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelected(c);
                  setManifest(null);
                  setConfirm('');
                }}
                className={`text-left p-5 rounded-2xl border transition-all hover:-translate-y-0.5 ${
                  selected?.id === c.id
                    ? 'border-accent bg-accent/5'
                    : 'border-ink/10 bg-paper hover:border-ink/20'
                }`}
              >
                <p className="text-xs uppercase tracking-widest text-ink-400">
                  {c.universityName}
                </p>
                <p className="serif text-3xl mt-1">Class of {c.year}</p>
                <p className="text-xs text-ink-500 mt-3">
                  {c.graduatesCount} graduates · status: {c.status}
                </p>
              </button>
            ))}
        </ul>
      </div>

      <div className="rounded-3xl bg-ink text-paper p-7 shadow-soft">
        <p className="text-xs uppercase tracking-widest text-accent">
          Seal preview
        </p>
        {!selected ? (
          <p className="serif text-2xl mt-2">Select a class.</p>
        ) : (
          <>
            <p className="serif text-2xl mt-2">
              {selected.universityName} · Class of {selected.year}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-paper/80">
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 mt-0.5 text-accent" />
                All {selected.graduatesCount} approved profiles will be cloned to{' '}
                <code className="text-accent">archive/&lt;snapshotId&gt;</code>.
              </li>
              <li className="flex items-start gap-3">
                <Lock className="h-4 w-4 mt-0.5 text-accent" />
                Profiles in this class become read-only.
              </li>
              <li className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-rose" />
                This action cannot be undone.
              </li>
            </ul>

            <div className="hairline my-6 opacity-30" />
            <label className="block text-xs uppercase tracking-widest text-paper/60 mb-2">
              Type <b>SEAL</b> to confirm
            </label>
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="SEAL"
              className="h-11 w-full rounded-2xl bg-paper/10 border border-paper/15 px-4 text-sm text-paper placeholder:text-paper/40"
            />
            <Button
              variant="accent"
              size="lg"
              disabled={confirm !== 'SEAL' || sealing}
              onClick={doSeal}
              className="w-full mt-4"
            >
              <Lock className="h-4 w-4" />
              {sealing ? 'Sealing…' : 'Seal class forever'}
            </Button>
          </>
        )}
        <AnimatePresence>
          {manifest && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl bg-accent/15 border border-accent/30 p-4"
            >
              <Badge variant="sealed">Sealed</Badge>
              <p className="text-xs mt-2 text-paper/70">Manifest SHA-256:</p>
              <code className="text-[10px] text-accent break-all">{manifest}</code>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
