import { SiteNav } from '@/components/site-nav';

export default function Loading() {
  return (
    <>
      <SiteNav />
      <main className="pt-28 sm:pt-36">
        <section className="container">
          <div className="h-3 w-32 rounded-full bg-ink/10 animate-pulse" />
          <div className="mt-6 h-14 w-2/3 max-w-xl rounded-2xl bg-ink/5 animate-pulse" />
          <div className="mt-3 h-14 w-1/2 max-w-md rounded-2xl bg-ink/5 animate-pulse" />
        </section>
        <section className="container mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden bg-white border border-ink/5"
            >
              <div className="aspect-[4/3] bg-ink/5 animate-pulse" />
              <div className="p-5 flex gap-3">
                <div className="h-3 w-24 rounded-full bg-ink/10 animate-pulse" />
                <div className="h-3 w-16 rounded-full bg-ink/10 animate-pulse" />
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
