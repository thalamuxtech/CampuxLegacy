import { adminStore } from '@/lib/admin-store';
import { listOnboarding } from '@/lib/firestore-server';
import { PageHeader } from '@/components/admin/page-header';
import { OnboardingTable } from '@/components/admin/onboarding-table';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const fromFirestore = await listOnboarding();
  const items = fromFirestore ?? adminStore().onboarding;
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inbox"
        title="Onboarding requests"
        subtitle="University-level requests to join CampuxLegacy. Review, approve or reject."
      />
      <OnboardingTable initial={items} />
    </div>
  );
}
