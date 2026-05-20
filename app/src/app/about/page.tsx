import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { Reveal } from '@/components/reveal';

export const metadata = { title: 'About' };

const pillars = [
  {
    label: 'Identity',
    body: 'Verified profiles, sealed by the institution. A yearbook only as trustworthy as its signature.',
  },
  {
    label: 'Memory',
    body: 'The lecture notes blur. The friendships do not. We capture both — in a form that survives broken laptops and lost phones.',
  },
  {
    label: 'Legacy',
    body: 'Once sealed, a class becomes an immutable archive — signed, cryptographically witnessed, and preserved.',
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-28 sm:pt-36">
        <section className="container max-w-3xl">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
              About CampuxLegacy
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="serif text-5xl sm:text-7xl mt-3 leading-[0.95]">
              Memories deserve better than a group chat.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="dropcap mt-12 text-lg text-ink-700 leading-relaxed">
              Across Africa, graduation memories are often scattered across phones,
              lost to broken laptops, or never properly preserved at all.
              CampuxLegacy turns those once-in-a-lifetime moments into a lasting
              digital asset for students and the institutions that shaped them.
              From the first matriculation photograph to the convocation speech,
              we capture, verify and seal the story of every graduating class —
              forever.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="serif text-3xl mt-16">Our vision</h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 text-ink-700 leading-relaxed">
              To become Africa&apos;s leading digital yearbook and alumni memory
              platform — starting from Nigeria, and expanding across universities,
              polytechnics and higher institutions on the continent.
            </p>
          </Reveal>
        </section>

        <section className="container mt-24">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
              What we preserve
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="serif text-4xl mt-2 max-w-2xl">
              Three pillars, one archive.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.label} delay={0.05 + i * 0.05}>
                <div className="rounded-3xl border border-ink/10 bg-white p-7 h-full">
                  <p className="text-xs uppercase tracking-widest text-accent-700">
                    {p.label}
                  </p>
                  <p className="serif text-2xl mt-2">{p.body.split('.')[0]}.</p>
                  <p className="mt-3 text-ink-600 leading-relaxed">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="container max-w-3xl mt-24 pb-24">
          <Reveal>
            <h2 className="serif text-3xl">Why this matters</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-4 text-ink-700 leading-relaxed">
              A yearbook is more than a record. It is a trusted archive of
              identity, achievement, friendship and legacy — a place to remember
              who you were when the world was still uncertain about what you would
              become.
            </p>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
