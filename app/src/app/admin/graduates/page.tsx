import { demoGraduates } from '@/lib/demo-data';
import { PageHeader } from '@/components/admin/page-header';
import { GraduatesManager } from '@/components/admin/graduates-manager';

export const dynamic = 'force-dynamic';

export default function GraduatesAdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalogue"
        title="Graduates"
        subtitle="All graduating profiles across every university. Filter, search, review or open the public profile."
      />
      <GraduatesManager initial={demoGraduates} />
    </div>
  );
}
