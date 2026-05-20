import { adminStore } from '@/lib/admin-store';
import { listPendingGoodwills } from '@/lib/firestore-server';
import { PageHeader } from '@/components/admin/page-header';
import { GoodwillsModeration } from '@/components/admin/goodwills-moderation';

export const dynamic = 'force-dynamic';

export default async function GoodwillsAdminPage() {
  const fromFirestore = await listPendingGoodwills();
  const items = fromFirestore ?? adminStore().goodwills;
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Moderation"
        title="Goodwill messages"
        subtitle="Approve, reject or flag goodwill messages before they appear on graduate profiles."
      />
      <GoodwillsModeration initial={items} />
    </div>
  );
}
