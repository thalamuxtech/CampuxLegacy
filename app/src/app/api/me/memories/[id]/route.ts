import { NextRequest, NextResponse } from 'next/server';
import { requireSignedIn } from '@/lib/auth-server';
import { getAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';

const patchSchema = z.object({
  title: z.string().min(1).max(80).optional(),
  body: z.string().min(1).max(800).optional(),
  imageUrl: z.string().url().optional(),
});

async function resolveGraduateRef(uid: string) {
  const admin = getAdmin();
  if (!admin) return null;
  const userSnap = await admin.db.collection('users').doc(uid).get();
  const ref = userSnap.data()?.graduateRef as string | undefined;
  if (!ref) return null;
  return admin.db.doc(ref);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = getAdmin();
  if (!admin) return NextResponse.json({ ok: true, demo: true });
  const session = await requireSignedIn();
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const gradRef = await resolveGraduateRef(session.uid);
  if (!gradRef)
    return NextResponse.json({ error: 'No linked graduate' }, { status: 409 });
  await gradRef.collection('memories').doc(params.id).update(parsed.data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = getAdmin();
  if (!admin) return NextResponse.json({ ok: true, demo: true });
  const session = await requireSignedIn();
  const gradRef = await resolveGraduateRef(session.uid);
  if (!gradRef)
    return NextResponse.json({ error: 'No linked graduate' }, { status: 409 });
  await gradRef.collection('memories').doc(params.id).delete();
  return NextResponse.json({ ok: true });
}
