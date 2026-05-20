import { demoGraduates } from '@/lib/demo-data';
import { listAllGraduatesForAdmin } from '@/lib/firestore-server';
import { PageHeader } from '@/components/admin/page-header';
import { GraduatesManager } from '@/components/admin/graduates-manager';
import type { Graduate } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function GraduatesAdminPage() {
  const fromFirestore = await listAllGraduatesForAdmin();
  const items = (fromFirestore && fromFirestore.length > 0
    ? (fromFirestore as unknown as Graduate[])
    : demoGraduates) as Graduate[];
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalogue"
        title="Graduates"
        subtitle="All graduating profiles across every university. Filter, search, review or open the public profile."
      />
      <GraduatesManager initial={items} />
    </div>
  );
}
