import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdmin } from './firebase-admin';

export type Roles = Partial<
  Record<
    | 'student'
    | 'alumni'
    | 'rep'
    | 'university_admin'
    | 'official'
    | 'superadmin',
    boolean
  >
>;

export type Session = {
  uid: string;
  email: string | null;
  roles: Roles;
};

const COOKIE = '__session';

export async function getSession(): Promise<Session | null> {
  const cookie = cookies().get(COOKIE)?.value;
  if (!cookie) return null;
  const admin = getAdmin();
  if (!admin) return null;
  try {
    const decoded = await admin.auth.verifySessionCookie(cookie, true);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      roles: ((decoded as { roles?: Roles }).roles ?? {}) as Roles,
    };
  } catch {
    return null;
  }
}

export async function requireSignedIn(redirectTo = '/sign-in'): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(redirectTo);
  return session;
}

export function isAdmin(session: Session | null): boolean {
  if (!session) return false;
  return Boolean(session.roles.superadmin || session.roles.university_admin);
}

export async function requireAdmin(redirectTo = '/sign-in?next=/admin'): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(redirectTo);
  if (!isAdmin(session)) redirect('/?error=forbidden');
  return session;
}
