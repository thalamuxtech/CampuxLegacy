'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '/universities', label: 'Universities' },
  { href: '/search', label: 'Search' },
  { href: '/about', label: 'About' },
  { href: '/for-schools', label: 'For Schools' },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-editorial',
        scrolled ? 'pt-3 sm:pt-4' : 'pt-0'
      )}
    >
      <div className="container">
        <motion.div
          initial={false}
          animate={{
            paddingInline: scrolled ? 16 : 0,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={cn(
            'flex h-16 sm:h-20 items-center justify-between transition-all duration-500 ease-editorial',
            scrolled
              ? 'glass rounded-full px-5 sm:px-6 shadow-editorial'
              : 'px-0'
          )}
        >
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div
              initial={{ rotate: -8 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-paper transition-colors group-hover:bg-accent"
            >
              <Sparkles className="h-4 w-4" />
            </motion.div>
            <span className="serif text-xl font-medium tracking-tight">
              CampuxLegacy
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-full text-sm text-ink/70 hover:text-ink hover:bg-ink/5 transition-colors duration-300"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" aria-label="Search">
              <Link href="/search">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="accent" size="sm">
              <Link href="/for-schools">Onboard your school</Link>
            </Button>
          </div>

          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-paper/80 backdrop-blur-md transition-colors hover:bg-paper"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="md:hidden mt-2 mx-4 rounded-3xl glass-card overflow-hidden"
          >
            <div className="px-5 py-5 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 px-2 text-base text-ink rounded-lg hover:bg-ink/5"
                >
                  {l.label}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-4">
                <Button asChild variant="outline">
                  <Link href="/sign-in" onClick={() => setOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild variant="accent">
                  <Link href="/for-schools" onClick={() => setOpen(false)}>
                    Onboard school
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
