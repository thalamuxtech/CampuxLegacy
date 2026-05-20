import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-ink/10 bg-ink text-paper">
      <div className="container py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="serif text-3xl font-medium">CampuxLegacy</p>
          <p className="mt-3 text-sm text-paper/70 max-w-md">
            A trusted digital archive of identity, achievement, friendship and
            legacy — built for African universities, starting from Nigeria.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3">Platform</p>
          <ul className="space-y-2 text-sm text-paper/70">
            <li><Link href="/universities">Universities</Link></li>
            <li><Link href="/search">Search graduates</Link></li>
            <li><Link href="/for-schools">For institutions</Link></li>
            <li><Link href="/privacy">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold mb-3">Company</p>
          <ul className="space-y-2 text-sm text-paper/70">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-paper/60">
          <p>© {new Date().getFullYear()} CampuxLegacy. All memories preserved.</p>
          <p>Made with care in Lagos, Nigeria.</p>
        </div>
      </div>
    </footer>
  );
}
