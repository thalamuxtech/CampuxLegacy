'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Inbox,
  HeartHandshake,
  GraduationCap,
  Building2,
  Mail,
  ShieldCheck,
  Lock,
  KeyRound,
  Search,
  CornerDownLeft,
} from 'lucide-react';

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

const COMMANDS: Cmd[] = [
  { id: 'overview', label: 'Overview', hint: 'Mission control', icon: LayoutDashboard, href: '/admin' },
  { id: 'onboarding', label: 'Onboarding requests', icon: Inbox, href: '/admin/onboarding' },
  { id: 'goodwills', label: 'Goodwill moderation', icon: HeartHandshake, href: '/admin/goodwills' },
  { id: 'graduates', label: 'Graduates', icon: GraduationCap, href: '/admin/graduates' },
  { id: 'universities', label: 'Universities', icon: Building2, href: '/admin/universities' },
  { id: 'contacts', label: 'Contact inbox', icon: Mail, href: '/admin/contacts' },
  { id: 'roles', label: 'Roles', hint: 'Grant or revoke claims', icon: KeyRound, href: '/admin/roles' },
  { id: 'audit', label: 'Audit log', icon: ShieldCheck, href: '/admin/audit' },
  { id: 'seal', label: 'Seal class', hint: 'Irreversible', icon: Lock, href: '/admin/seal' },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!q) return COMMANDS;
    const n = q.toLowerCase();
    return COMMANDS.filter(
      (c) => c.label.toLowerCase().includes(n) || c.hint?.toLowerCase().includes(n)
    );
  }, [q]);

  function go(cmd: Cmd) {
    setOpen(false);
    router.push(cmd.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const c = filtered[active];
      if (c) go(c);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-start pt-24 px-4 bg-ink/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto w-full max-w-xl rounded-3xl bg-paper border border-ink/10 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-ink/10">
              <Search className="h-4 w-4 text-ink-400" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Jump to…"
                className="flex-1 bg-transparent outline-none placeholder:text-ink-400 text-base"
              />
              <kbd className="text-[10px] uppercase tracking-widest text-ink-400 border border-ink/10 rounded px-1.5 py-0.5">
                Esc
              </kbd>
            </div>
            <ul className="max-h-[60vh] overflow-auto py-2">
              {filtered.length === 0 && (
                <li className="px-5 py-6 text-center text-ink-500 text-sm">
                  No matches.
                </li>
              )}
              {filtered.map((c, i) => {
                const isActive = i === active;
                return (
                  <li key={c.id}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(c)}
                      className={`w-full flex items-center gap-3 px-5 py-2.5 text-left text-sm transition-colors ${
                        isActive ? 'bg-ink/[0.06]' : ''
                      }`}
                    >
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink/5">
                        <c.icon className="h-4 w-4" />
                      </span>
                      <span className="flex-1">
                        <span className="block">{c.label}</span>
                        {c.hint && (
                          <span className="text-xs text-ink-500">{c.hint}</span>
                        )}
                      </span>
                      {isActive && (
                        <CornerDownLeft className="h-3.5 w-3.5 text-ink-400" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-ink/10 px-5 py-2.5 text-[10px] text-ink-400 flex items-center justify-between">
              <span>Navigate with ↑ ↓ · Enter to open</span>
              <span>⌘K / Ctrl+K to toggle</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
