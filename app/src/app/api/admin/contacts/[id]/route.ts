import { NextRequest, NextResponse } from 'next/server';
import { deleteContact, markContactRead } from '@/lib/admin-store';
import { deleteContactDoc, markContactDoc } from '@/lib/firestore-server';
import { getSession, isAdmin } from '@/lib/auth-server';
import { getAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';

const schema = z.object({ read: z.boolean() });

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

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  markContactRead(params.id, parsed.data.read);
  if (g.adminConfigured) {
    await markContactDoc(params.id, parsed.data.read);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const g = await guard();
  if ('error' in g) return g.error;

  deleteContact(params.id);
  if (g.adminConfigured) {
    await deleteContactDoc(params.id);
  }
  return NextResponse.json({ ok: true });
}
