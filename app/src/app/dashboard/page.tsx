import { getAdmin } from '@/lib/firebase-admin';
import { getSession } from '@/lib/auth-server';
import { DashboardClient } from './dashboard-client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const adminConfigured = Boolean(getAdmin());
  const session = await getSession();

  if (adminConfigured && !session) {
    const { redirect } = await import('next/navigation');
    redirect('/sign-in?next=/dashboard');
  }

  return <DashboardClient initialEmail={session?.email ?? null} />;
}
