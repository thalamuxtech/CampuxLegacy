import { PageHeader } from '@/components/admin/page-header';
import { RolesManager } from '@/components/admin/roles-manager';
import { getAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export default async function RolesPage() {
  const adminConfigured = Boolean(getAdmin());
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Access control"
        title="Roles"
        subtitle="Grant or revoke platform roles. Superadmin only."
      />
      <RolesManager demoMode={!adminConfigured} />
    </div>
  );
}
