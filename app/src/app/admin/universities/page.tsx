import Image from 'next/image';
import Link from 'next/link';
import { demoUniversities, demoClasses, demoGraduates } from '@/lib/demo-data';
import { PageHeader } from '@/components/admin/page-header';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function UniversitiesAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Institutions"
        title="Universities"
        subtitle="Enrolled universities, their classes, and sealing status."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {demoUniversities.map((u) => {
          const classes = demoClasses.filter((c) => c.universityId === u.id);
          const grads = demoGraduates.filter((g) => g.universityId === u.id);
          const sealed = classes.filter((c) => c.status === 'sealed').length;
          return (
            <div
              key={u.id}
              className="rounded-3xl overflow-hidden bg-white border border-ink/10 shadow-soft"
            >
              <div className="relative aspect-[3/2]">
                <Image
                  src={u.coverImage!}
                  alt={u.name}
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(180deg, transparent 40%, ${u.branding?.primary ?? '#0B0B0F'}E6 100%)`,
                  }}
                />
                <div className="absolute bottom-4 left-4 right-4 text-paper">
                  <p className="text-[10px] uppercase opacity-80">
                    {u.city}, {u.country}
                  </p>
                  <p className="serif text-xl mt-0.5 leading-tight">{u.name}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <Stat label="Graduates" value={grads.length} />
                  <Stat label="Classes" value={classes.length} />
                  <Stat label="Sealed" value={sealed} />
                </div>
                <div className="hairline my-4" />
                <ul className="space-y-1.5 max-h-40 overflow-auto pr-1">
                  {classes.map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>Class of {c.year}</span>
                      <Badge
                        variant={c.status === 'sealed' ? 'sealed' : 'accent'}
                      >
                        {c.status === 'sealed' && (
                          <Lock className="h-3 w-3" />
                        )}{' '}
                        {c.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/universities/${u.slug}`}
                  target="_blank"
                  className="mt-4 inline-flex items-center gap-1 text-sm link-grow"
                >
                  View public page <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-ink/5 p-3">
      <p className="text-[10px] uppercase tracking-widest text-ink-400">
        {label}
      </p>
      <p className="serif text-xl mt-0.5">{value}</p>
    </div>
  );
}
