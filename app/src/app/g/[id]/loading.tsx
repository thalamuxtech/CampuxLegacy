import { SiteNav } from '@/components/site-nav';

export default function Loading() {
  return (
    <>
      <SiteNav />
      <main className="pt-28">
        <div className="container">
          <div className="h-3 w-48 rounded-full bg-ink/10 animate-pulse" />
        </div>
        <section className="container mt-8 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="aspect-[4/5] rounded-3xl bg-ink/5 animate-pulse" />
          </div>
          <div className="lg:col-span-7 space-y-4">
            <div className="h-3 w-40 rounded-full bg-ink/10 animate-pulse" />
            <div className="h-14 w-3/4 rounded-2xl bg-ink/5 animate-pulse" />
            <div className="h-4 w-1/2 rounded-full bg-ink/10 animate-pulse" />
            <div className="mt-10 space-y-3">
              <div className="h-4 w-full rounded-full bg-ink/5 animate-pulse" />
              <div className="h-4 w-5/6 rounded-full bg-ink/5 animate-pulse" />
              <div className="h-4 w-4/6 rounded-full bg-ink/5 animate-pulse" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
