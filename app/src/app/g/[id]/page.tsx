import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { getGraduateById } from '@/lib/demo-data';
import { GraduateProfile } from '@/components/graduate-profile';

export default function GraduatePage({ params }: { params: { id: string } }) {
  const g = getGraduateById(params.id);
  if (!g) notFound();
  return (
    <>
      <SiteNav />
      <main className="pt-28">
        <div className="container">
          <Link
            href={`/universities/${g.universityId === 'ui' ? 'university-of-ibadan' : g.universityId === 'unilag' ? 'university-of-lagos' : g.universityId === 'oau' ? 'obafemi-awolowo-university' : 'covenant-university'}/${g.year}`}
            className="text-sm text-ink-500 hover:text-ink underline-offset-4 hover:underline"
          >
            ← Class of {g.year} · {g.universityName}
          </Link>
        </div>
        <GraduateProfile graduate={g} />
      </main>
      <SiteFooter />
    </>
  );
}
