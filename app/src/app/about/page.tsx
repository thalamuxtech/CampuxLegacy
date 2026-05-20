import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="pt-28 sm:pt-36">
        <section className="container max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent-700">
            About CampuxLegacy
          </p>
          <h1 className="serif text-5xl sm:text-7xl mt-3 leading-[0.95]">
            Memories deserve better than a group chat.
          </h1>
          <p className="dropcap mt-12 text-lg text-ink-700 leading-relaxed">
            Across Africa, graduation memories are often scattered across phones,
            lost to broken laptops, or never properly preserved at all.
            CampuxLegacy turns those once-in-a-lifetime moments into a lasting
            digital asset for students and the institutions that shaped them.
            From the first matriculation photograph to the convocation speech,
            we capture, verify and seal the story of every graduating class —
            forever.
          </p>

          <h2 className="serif text-3xl mt-16">Our vision</h2>
          <p className="mt-4 text-ink-700 leading-relaxed">
            To become Africa's leading digital yearbook and alumni memory
            platform — starting from Nigeria, and expanding across universities,
            polytechnics and higher institutions on the continent.
          </p>

          <h2 className="serif text-3xl mt-16">Why this matters</h2>
          <p className="mt-4 text-ink-700 leading-relaxed">
            A yearbook is more than a record. It is a trusted archive of
            identity, achievement, friendship and legacy — a place to remember
            who you were when the world was still uncertain about what you would
            become.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
