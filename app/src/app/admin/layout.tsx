import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/admin-shell';
import { getSession, isAdmin, type Session } from '@/lib/auth-server';
import { getAdmin } from '@/lib/firebase-admin';

export const metadata: Metadata = { title: 'Admin Console' };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminConfigured = Boolean(getAdmin());
  let session: Session | null = await getSession();

  if (adminConfigured) {
    if (!session) redirect('/sign-in?next=/admin');
    if (!isAdmin(session)) redirect('/?error=forbidden');
  } else if (!session) {
    // Demo mode: synthesize a session so the console is browseable locally.
    session = {
      uid: 'demo',
      email: 'demo@campuxlegacy.app',
      roles: { superadmin: true },
    };
  }

  return (
    <AdminShell
      sessionEmail={session!.email ?? 'admin'}
      demoMode={!adminConfigured}
    >
      {children}
    </AdminShell>
  );
}
