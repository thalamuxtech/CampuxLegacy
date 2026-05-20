import { demoClasses, demoUniversities } from '@/lib/demo-data';
import { listAllClassesForAdmin } from '@/lib/firestore-server';
import { PageHeader } from '@/components/admin/page-header';
import { SealClassPanel } from '@/components/admin/seal-class-panel';

export const dynamic = 'force-dynamic';

export default async function SealClassPage() {
  const fromFirestore = await listAllClassesForAdmin();
  const classes =
    fromFirestore && fromFirestore.length > 0
      ? fromFirestore
      : demoClasses.map((c) => ({
          id: c.id,
          universityId: c.universityId,
          universityName:
            demoUniversities.find((u) => u.id === c.universityId)?.name ?? c.universityId,
          year: c.year,
          status: c.status,
          graduatesCount: c.graduatesCount,
        }));
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Lifecycle"
        title="Seal a class"
        subtitle="Snapshot every approved graduate into an immutable archive. This action is irreversible."
      />
      <SealClassPanel classes={classes} />
    </div>
  );
}
