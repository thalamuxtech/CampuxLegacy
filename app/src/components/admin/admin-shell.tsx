'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  ChevronRight,
  Sparkles,
  Bell,
  Search,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/onboarding', label: 'Onboarding', icon: Inbox },
  { href: '/admin/goodwills', label: 'Goodwills', icon: HeartHandshake },
  { href: '/admin/graduates', label: 'Graduates', icon: GraduationCap },
  { href: '/admin/universities', label: 'Universities', icon: Building2 },
  { href: '/admin/contacts', label: 'Contact inbox', icon: Mail },
  { href: '/admin/audit', label: 'Audit log', icon: ShieldCheck },
  { href: '/admin/seal', label: 'Seal class', icon: Lock },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-dvh bg-[#F5F2EC] text-ink">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden lg:flex w-[260px] flex-col border-r border-ink/10 bg-ink text-paper">
        <div className="px-6 pt-7 pb-5 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="serif text-lg leading-none">CampuxLegacy</p>
            <p className="text-[10px] uppercase tracking-widest text-paper/50 mt-1">
              Admin console
            </p>
          </div>
        </div>

        <nav className="flex-1 px-3 mt-4 space-y-0.5">
          {nav.map((n) => {
            const active = n.exact
              ? pathname === n.href
              : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  active
                    ? 'bg-paper/10 text-paper'
                    : 'text-paper/60 hover:text-paper hover:bg-paper/5'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="adminNavDot"
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-accent"
                  />
                )}
                <n.icon className="h-4 w-4 opacity-80" />
                <span>{n.label}</span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
              </Link>
            );
          })}
        </nav>

        <div className="px-5 pb-6 mt-6">
          <div className="rounded-2xl bg-paper/5 ring-1 ring-paper/10 p-4">
            <p className="text-xs uppercase tracking-widest text-accent">Pro tip</p>
            <p className="mt-2 text-sm text-paper/80">
              Hit ⌘K to jump anywhere in seconds.
            </p>
          </div>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-xs text-paper/60 hover:text-paper"
          >
            <ChevronRight className="h-3 w-3 rotate-180" /> Back to site
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-30 bg-ink text-paper">
        <div className="flex items-center justify-between px-5 h-14">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="serif text-base">Admin</span>
          </Link>
          <Link href="/" className="text-xs text-paper/70">
            Back to site
          </Link>
        </div>
        <div className="flex overflow-x-auto px-2 pb-2 gap-1 no-scrollbar">
          {nav.map((n) => {
            const active = n.exact
              ? pathname === n.href
              : pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  'whitespace-nowrap rounded-full px-3 py-1.5 text-xs',
                  active ? 'bg-paper text-ink' : 'bg-paper/10 text-paper/80'
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main */}
      <div className="lg:pl-[260px]">
        <div className="sticky top-0 z-20 hidden lg:flex h-16 items-center gap-4 border-b border-ink/10 bg-[#F5F2EC]/80 backdrop-blur px-8">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search graduates, universities, requests…"
              className="h-10 w-full rounded-full bg-white border border-ink/10 pl-9 pr-4 text-sm placeholder:text-ink-400 focus:outline-none focus:border-ink/30"
            />
          </div>
          <button className="relative grid h-10 w-10 place-items-center rounded-full bg-white border border-ink/10 hover:border-ink/30">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
          </button>
          <div className="flex items-center gap-3 pl-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper text-xs font-medium">
              SA
            </div>
            <div className="hidden xl:block">
              <p className="text-sm font-medium leading-none">Superadmin</p>
              <p className="text-xs text-ink-500 mt-1">thalamuxtech@gmail.com</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 sm:px-8 py-8"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
