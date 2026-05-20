import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import {
  getGraduateById as demoGraduateById,
  demoUniversities,
} from '@/lib/demo-data';
import { getGraduatePublic } from '@/lib/firestore-server';
import { GraduateProfile } from '@/components/graduate-profile';
import type { Graduate } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function GraduatePage({
  params,
}: {
  params: { id: string };
}) {
  // Try Firestore first.
  const fromFirestore = await getGraduatePublic(params.id);
  let graduate: Graduate | null = null;
  let universitySlug: string | null = null;

  if (fromFirestore) {
    graduate = {
      ...(fromFirestore.graduate as Graduate),
      memories: fromFirestore.memories as Graduate['memories'],
      goodwills: fromFirestore.goodwills as Graduate['goodwills'],
    };
    universitySlug = fromFirestore.universitySlug;
  } else {
    const demo = demoGraduateById(params.id);
    if (!demo) notFound();
    graduate = demo;
    universitySlug =
      demoUniversities.find((u) => u.id === demo.universityId)?.slug ?? null;
  }

  // Final fallback: if universitySlug still null, link to /universities.
  const backHref =
    universitySlug && graduate.year
      ? `/universities/${universitySlug}/${graduate.year}`
      : '/universities';

  return (
    <>
      <SiteNav />
      <main className="pt-28">
        <div className="container">
          <Link
            href={backHref}
            className="text-sm text-ink-500 hover:text-ink underline-offset-4 hover:underline"
          >
            ← Class of {graduate.year} · {graduate.universityName}
          </Link>
        </div>
        <GraduateProfile graduate={graduate} />
      </main>
      <SiteFooter />
    </>
  );
}

