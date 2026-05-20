import {
  adminMetrics,
  classDistribution,
  recentSignups,
  universityBreakdown,
  adminStore,
} from '@/lib/admin-store';
import { adminOverview, listAudit } from '@/lib/firestore-server';
import { AdminStats } from '@/components/admin/admin-stats';
import { ClassChart } from '@/components/admin/class-chart';
import { UniversityBars } from '@/components/admin/university-bars';
import { RecentSignups } from '@/components/admin/recent-signups';
import { AuditFeed } from '@/components/admin/audit-feed';
import { PageHeader } from '@/components/admin/page-header';
import type { Graduate } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminOverview() {
  const live = await adminOverview();
  const m = live?.metrics ?? adminMetrics();
  const dist = live?.distribution ?? classDistribution();
  const breakdown = live?.breakdown ?? universityBreakdown();
  const recent: Graduate[] = live
    ? (live.recent.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        portraitUrl: r.portraitUrl,
        departmentName: r.departmentName ?? '',
        universityName: r.universityName ?? '',
        status: r.status,
        year: r.year,
      })) as unknown as Graduate[])
    : recentSignups(6);

  const auditFromFirestore = await listAudit(6);
  const audit = auditFromFirestore ?? adminStore().audit.slice(0, 6);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Admin Console"
        title="Mission control"
        subtitle="A live view of the platform — graduates, requests and goodwills."
      />

      <AdminStats metrics={m} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl bg-white border border-ink/10 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Graduates by class year
              </p>
              <p className="serif text-2xl mt-1">Growth over time</p>
            </div>
          </div>
          {dist.length === 0 ? (
            <div className="grid place-items-center h-[220px] text-sm text-ink-400">
              No data yet.
            </div>
          ) : (
            <ClassChart data={dist} />
          )}
        </div>
        <div className="rounded-3xl bg-white border border-ink/10 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-widest text-ink-400">
            Universities breakdown
          </p>
          <p className="serif text-2xl mt-1 mb-4">Top contributors</p>
          {breakdown.length === 0 ? (
            <p className="text-sm text-ink-400">No universities yet.</p>
          ) : (
            <UniversityBars data={breakdown} />
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl bg-white border border-ink/10 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-ink-400">
                Latest activity
              </p>
              <p className="serif text-2xl mt-1">Recent graduate sign-ups</p>
            </div>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-ink-400">No sign-ups yet.</p>
          ) : (
            <RecentSignups data={recent} />
          )}
        </div>
        <div className="rounded-3xl bg-ink text-paper p-6 shadow-soft">
          <p className="text-xs uppercase tracking-widest text-accent">
            System log
          </p>
          <p className="serif text-2xl mt-1 mb-4">Audit feed</p>
          {audit.length === 0 ? (
            <p className="text-sm text-paper/60">No events recorded.</p>
          ) : (
            <AuditFeed data={audit} />
          )}
        </div>
      </div>
    </div>
  );
}
