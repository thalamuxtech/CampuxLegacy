import Link from 'next/link';
import Image from 'next/image';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { demoUniversities } from '@/lib/demo-data';
import { ArrowUpRight } from 'lucide-react';

export const metadata = { title: 'Universities' };

export default function UniversitiesPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-28 sm:pt-36">
        <section className="container">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
            Enrolled institutions
          </p>
          <h1 className="serif text-5xl sm:text-6xl mt-3 max-w-2xl">
            African universities preserving their legacy.
          </h1>
          <p className="mt-5 text-ink-600 max-w-xl">
            Discover the graduating classes, the schools, and the faces behind
            them.
          </p>
        </section>

        <section className="container mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {demoUniversities.map((u) => (
            <Link
              key={u.id}
              href={`/universities/${u.slug}`}
              className="group block rounded-3xl overflow-hidden bg-white border border-ink/10 hover:border-ink/30 transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={u.coverImage!}
                  alt={u.name}
                  fill
                  sizes="(min-width:1024px) 33vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, transparent 40%, ${u.branding?.primary ?? '#0B0B0F'}E6 100%)`,
                  }}
                />
                <div className="absolute bottom-5 left-5 right-5 text-paper">
                  <p className="text-xs opacity-80">
                    {u.city}, {u.country}
                  </p>
                  <p className="serif text-2xl mt-1 leading-tight">{u.name}</p>
                  {u.motto && (
                    <p className="text-xs italic opacity-80 mt-1">
                      {u.motto}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex gap-5 text-xs text-ink-600">
                  <span>
                    <b className="text-ink">
                      {u.graduatesCount.toLocaleString()}
                    </b>{' '}
                    graduates
                  </span>
                  <span>
                    <b className="text-ink">{u.classesCount}</b> classes
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-ink-400 group-hover:text-accent transition-colors" />
              </div>
            </Link>
          ))}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
