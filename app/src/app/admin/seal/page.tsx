import { demoClasses, demoUniversities } from '@/lib/demo-data';
import { PageHeader } from '@/components/admin/page-header';
import { SealClassPanel } from '@/components/admin/seal-class-panel';

export const dynamic = 'force-dynamic';

export default function SealClassPage() {
  const classes = demoClasses.map((c) => ({
    ...c,
    universityName:
      demoUniversities.find((u) => u.id === c.universityId)?.name ?? c.universityId,
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
