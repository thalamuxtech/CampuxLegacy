import { adminStore } from '@/lib/admin-store';
import { listAudit } from '@/lib/firestore-server';
import { PageHeader } from '@/components/admin/page-header';
import { AuditFeed } from '@/components/admin/audit-feed';

export const dynamic = 'force-dynamic';

export default async function AuditPage() {
  const fromFirestore = await listAudit(100);
  const data = fromFirestore ?? adminStore().audit;
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Security"
        title="Audit log"
        subtitle="Append-only record of significant platform events."
      />
      <div className="rounded-3xl bg-ink text-paper p-7 shadow-soft">
        <AuditFeed data={data} />
      </div>
    </div>
  );
}
