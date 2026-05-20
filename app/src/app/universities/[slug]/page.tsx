import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import {
  getClassesForUniversity,
  getUniversityBySlug,
} from '@/lib/demo-data';
import { Badge } from '@/components/ui/badge';
import { Lock, ArrowUpRight } from 'lucide-react';

export default function UniversityPage({
  params,
}: {
  params: { slug: string };
}) {
  const uni = getUniversityBySlug(params.slug);
  if (!uni) notFound();
  const classes = getClassesForUniversity(uni.id);

  return (
    <>
      <SiteNav />
      <main>
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
          <Image
            src={uni.coverImage!}
            alt={uni.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${uni.branding?.primary ?? '#0B0B0F'}99 0%, ${uni.branding?.primary ?? '#0B0B0F'}EE 100%)`,
            }}
          />
          <div className="absolute inset-0 flex items-end">
            <div className="container pb-12 sm:pb-16 text-paper">
              <p className="text-xs uppercase tracking-[0.25em] opacity-80">
                {uni.city}, {uni.country}
              </p>
              <h1 className="serif text-5xl sm:text-7xl mt-3 max-w-3xl">
                {uni.name}
              </h1>
              {uni.motto && (
                <p className="mt-3 italic opacity-80 text-lg">{uni.motto}</p>
              )}
              <div className="mt-6 flex gap-3 flex-wrap">
                <Badge variant="outline" className="border-paper/30 text-paper">
                  {uni.graduatesCount.toLocaleString()} graduates
                </Badge>
                <Badge variant="outline" className="border-paper/30 text-paper">
                  {classes.length} classes
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Classes grid */}
        <section className="container py-20 sm:py-28">
          <div className="flex items-end justify-between gap-6 mb-12 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
                Graduating classes
              </p>
              <h2 className="serif text-4xl mt-2">Choose a class to enter.</h2>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => (
              <Link
                key={c.id}
                href={`/universities/${uni.slug}/${c.year}`}
                className="group block rounded-3xl overflow-hidden bg-white border border-ink/10 hover:-translate-y-1 transition-transform"
              >
                <div className="relative aspect-[5/4]">
                  <Image
                    src={c.coverImage!}
                    alt={`Class of ${c.year}`}
                    fill
                    sizes="(min-width:1024px) 33vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/0" />
                  {c.status === 'sealed' && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="sealed">
                        <Lock className="h-3 w-3" /> Sealed
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-5 left-5 right-5 text-paper">
                    <p className="text-xs uppercase opacity-80 tracking-widest">
                      Class of
                    </p>
                    <p className="serif text-6xl mt-1 leading-none">
                      {c.year}
                    </p>
                    {c.theme && (
                      <p className="mt-2 italic opacity-90">"{c.theme}"</p>
                    )}
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between text-xs text-ink-600">
                  <span>
                    <b className="text-ink">{c.graduatesCount}</b> graduates
                  </span>
                  <span className="inline-flex items-center gap-1 group-hover:text-accent transition-colors">
                    Open yearbook
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
