import { NextRequest, NextResponse } from 'next/server';
import { approveGoodwill, rejectGoodwill } from '@/lib/admin-store';
import { approveGoodwillByPath, rejectGoodwillByPath } from '@/lib/firestore-server';
import { getSession, isAdmin } from '@/lib/auth-server';
import { getAdmin } from '@/lib/firebase-admin';

async function guard() {
  const adminConfigured = Boolean(getAdmin());
  const session = await getSession();
  if (adminConfigured) {
    if (!session) return { error: NextResponse.json({ error: 'Unauthenticated' }, { status: 401 }) };
    if (!isAdmin(session)) return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }
  return { adminConfigured, session };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const g = await guard();
  if ('error' in g) return g.error;

  const path = req.nextUrl.searchParams.get('path');
  approveGoodwill(params.id);
  if (g.adminConfigured && g.session && path) {
    await approveGoodwillByPath(path, g.session.uid);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const g = await guard();
  if ('error' in g) return g.error;

  const path = req.nextUrl.searchParams.get('path');
  rejectGoodwill(params.id);
  if (g.adminConfigured && g.session && path) {
    await rejectGoodwillByPath(path, g.session.uid);
  }
  return NextResponse.json({ ok: true });
}
