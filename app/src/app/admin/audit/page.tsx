import { adminStore } from '@/lib/admin-store';
import { PageHeader } from '@/components/admin/page-header';
import { AuditFeed } from '@/components/admin/audit-feed';

export const dynamic = 'force-dynamic';

export default function AuditPage() {
  const data = adminStore().audit;
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
