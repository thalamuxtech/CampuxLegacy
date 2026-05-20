'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, Trash2, CheckCheck, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Item = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export function ContactsInbox({ initial }: { initial: Item[] }) {
  const [items, setItems] = useState(initial);
  const [active, setActive] = useState<Item | null>(initial[0] ?? null);

  async function toggleRead(id: string, read: boolean) {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, read } : p)));
    if (active?.id === id) setActive({ ...active, read });
    await fetch(`/api/admin/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ read }),
    });
  }

  async function remove(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
    if (active?.id === id) setActive(null);
    toast.success('Removed');
    await fetch(`/api/admin/contacts/${id}`, { method: 'DELETE' });
  }

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-5">
      <div className="rounded-3xl bg-white border border-ink/10 overflow-hidden shadow-soft">
        <ul className="divide-y divide-ink/5 max-h-[70vh] overflow-auto">
          <AnimatePresence initial={false}>
            {items.map((c) => (
              <motion.li
                key={c.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  setActive(c);
                  if (!c.read) toggleRead(c.id, true);
                }}
                className={`cursor-pointer p-4 transition-colors hover:bg-ink/[0.03] ${
                  active?.id === c.id ? 'bg-ink/[0.04]' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm truncate ${
                      c.read ? 'text-ink-600' : 'font-semibold'
                    }`}
                  >
                    {c.name}
                  </p>
                  {!c.read && (
                    <span className="h-2 w-2 rounded-full bg-accent mt-1.5" />
                  )}
                </div>
                <p className="text-xs text-ink-500 truncate">{c.subject}</p>
                <p className="text-[10px] text-ink-400 mt-1">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </motion.li>
            ))}
          </AnimatePresence>
          {items.length === 0 && (
            <li className="p-10 text-center text-sm text-ink-500">Inbox zero.</li>
          )}
        </ul>
      </div>

      <div className="rounded-3xl bg-white border border-ink/10 p-7 shadow-soft min-h-[60vh]">
        {active ? (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-400">
                  Message
                </p>
                <p className="serif text-3xl mt-1">{active.subject}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleRead(active.id, !active.read)}
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark as {active.read ? 'unread' : 'read'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-rose hover:bg-rose/10"
                  onClick={() => remove(active.id)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
            <div className="hairline my-5" />
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-ink text-paper text-xs">
                {active.name
                  .split(' ')
                  .map((s) => s[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div>
                <p className="text-sm font-medium">{active.name}</p>
                <a
                  href={`mailto:${active.email}`}
                  className="text-xs text-ink-500 hover:underline"
                >
                  {active.email}
                </a>
              </div>
              <p className="ml-auto text-xs text-ink-400">
                {new Date(active.createdAt).toLocaleString()}
              </p>
            </div>
            <p className="mt-6 text-ink-800 leading-relaxed whitespace-pre-line">
              {active.message}
            </p>
            <div className="mt-8">
              <Button asChild variant="accent">
                <a href={`mailto:${active.email}?subject=Re:%20${encodeURIComponent(active.subject)}`}>
                  <Reply className="h-4 w-4" /> Reply via email
                </a>
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="h-full grid place-items-center text-ink-500">
            <div className="text-center">
              <Mail className="h-8 w-8 mx-auto text-ink-300" />
              <p className="mt-3">Select a message to read.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
