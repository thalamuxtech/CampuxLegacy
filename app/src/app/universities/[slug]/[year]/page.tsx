import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import {
  getGraduatesForClass as demoGradsFor,
  getUniversityBySlug as demoUniBySlug,
  demoClasses,
} from '@/lib/demo-data';
import {
  getClass,
  getUniversityBySlugPublic,
  listGraduatesForClassPublic,
} from '@/lib/firestore-server';
import { GraduateGrid } from '@/components/graduate-grid';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import type { Graduate } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ClassYearbookPage({
  params,
}: {
  params: { slug: string; year: string };
}) {
  let uni = await getUniversityBySlugPublic(params.slug);
  if (!uni) uni = demoUniBySlug(params.slug);
  if (!uni) notFound();

  const year = parseInt(params.year, 10);
  if (Number.isNaN(year)) notFound();

  let cls = await getClass(uni.id, year);
  let graduates: Graduate[] = [];

  if (cls) {
    const fromFirestore = await listGraduatesForClassPublic(uni.id, cls.id);
    graduates = (fromFirestore ?? []) as Graduate[];
  } else {
    const demoCls = demoClasses.find(
      (c) => c.universityId === uni!.id && c.year === year
    );
    if (!demoCls) notFound();
    cls = demoCls;
    graduates = demoGradsFor(uni.id, year);
  }

  return (
    <>
      <SiteNav />
      <main className="pt-28 sm:pt-36">
        <section className="container">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-accent-700">
                {uni.name}
              </p>
              <h1 className="serif text-6xl sm:text-8xl mt-3">
                Class of {year}
              </h1>
              {cls.theme && (
                <p className="mt-3 italic text-ink-600 text-xl">"{cls.theme}"</p>
              )}
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{graduates.length} graduates</Badge>
              {cls.status === 'sealed' ? (
                <Badge variant="sealed">
                  <Lock className="h-3 w-3" /> Sealed {cls.sealedAt}
                </Badge>
              ) : (
                <Badge variant="accent">Live</Badge>
              )}
            </div>
          </div>
          <div className="hairline mt-10" />
        </section>

        <section className="container py-12 sm:py-16">
          {graduates.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink/15 p-16 text-center text-ink-500">
              <p className="serif text-2xl">No graduates published yet.</p>
              <p className="mt-2 text-sm">
                Profiles appear once they&apos;re approved.
              </p>
            </div>
          ) : (
            <GraduateGrid graduates={graduates} />
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
