import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';
import { Hero } from '@/components/sections/hero';
import { TrustStrip } from '@/components/sections/trust-strip';
import { HowItWorks } from '@/components/sections/how-it-works';
import { FeatureShowcase } from '@/components/sections/feature-showcase';
import { ClassPreview } from '@/components/sections/class-preview';
import { PrivacyBlock } from '@/components/sections/privacy-block';
import { CTA } from '@/components/sections/cta';

export default function HomePage() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <FeatureShowcase />
        <ClassPreview />
        <PrivacyBlock />
        <CTA />
      </main>
      <SiteFooter />
    </>
  );
}
