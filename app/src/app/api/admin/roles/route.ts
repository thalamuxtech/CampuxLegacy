import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/lib/auth-server';
import { getAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';

const ALLOWED_ROLES = [
  'student',
  'alumni',
  'rep',
  'university_admin',
  'official',
  'superadmin',
] as const;

const patchSchema = z.object({
  uid: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(ALLOWED_ROLES),
  enabled: z.boolean(),
});

/**
 * GET /api/admin/roles?q=...
 * Lists the most recent users (or filtered by name/email substring).
 */
export async function GET(req: NextRequest) {
  const admin = getAdmin();
  if (!admin) return NextResponse.json({ users: [], demo: true });
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (!isAdmin(session))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // Only superadmin can list users.
  if (!session.roles.superadmin)
    return NextResponse.json({ error: 'Superadmin only' }, { status: 403 });

  const q = (req.nextUrl.searchParams.get('q') ?? '').toLowerCase();
  const list = await admin.auth.listUsers(100);
  const filtered = q
    ? list.users.filter(
        (u) =>
          u.email?.toLowerCase().includes(q) ||
          u.displayName?.toLowerCase().includes(q) ||
          u.uid.toLowerCase().includes(q)
      )
    : list.users;
  return NextResponse.json({
    users: filtered.map((u) => ({
      uid: u.uid,
      email: u.email ?? null,
      displayName: u.displayName ?? null,
      photoURL: u.photoURL ?? null,
      roles: (u.customClaims as { roles?: Record<string, boolean> } | undefined)
        ?.roles ?? {},
      createdAt: u.metadata.creationTime,
      lastSignIn: u.metadata.lastSignInTime,
    })),
  });
}

/**
 * PATCH /api/admin/roles
 * Body: { uid | email, role, enabled }
 * Toggles a single role on the user's custom claims. Superadmin only.
 */
export async function PATCH(req: NextRequest) {
  const admin = getAdmin();
  if (!admin) return NextResponse.json({ ok: true, demo: true });
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  if (!session.roles.superadmin)
    return NextResponse.json({ error: 'Superadmin only' }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: 'Invalid', issues: parsed.error.flatten() },
      { status: 400 }
    );

  let targetUid = parsed.data.uid;
  if (!targetUid && parsed.data.email) {
    try {
      const user = await admin.auth.getUserByEmail(parsed.data.email);
      targetUid = user.uid;
    } catch {
      return NextResponse.json({ error: 'No user with that email' }, { status: 404 });
    }
  }
  if (!targetUid)
    return NextResponse.json({ error: 'Provide uid or email' }, { status: 400 });

  const user = await admin.auth.getUser(targetUid);
  const existing = (user.customClaims ?? {}) as {
    roles?: Record<string, boolean>;
    graduateIds?: Record<string, boolean>;
  };
  const roles = { ...(existing.roles ?? {}) };
  if (parsed.data.enabled) roles[parsed.data.role] = true;
  else delete roles[parsed.data.role];

  await admin.auth.setCustomUserClaims(targetUid, { ...existing, roles });
  await admin.db.collection('audit').add({
    type: `role.${parsed.data.enabled ? 'granted' : 'revoked'}`,
    by: session.uid,
    detail: `${user.email ?? targetUid} → ${parsed.data.role}`,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, uid: targetUid, roles });
}
