import { NextRequest, NextResponse } from 'next/server';
import { requireSignedIn } from '@/lib/auth-server';
import { getAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';

const createSchema = z.object({
  title: z.string().min(1).max(80),
  body: z.string().min(1).max(800),
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

export async function GET() {
  const admin = getAdmin();
  if (!admin) return NextResponse.json({ memories: [], demo: true });
  const session = await requireSignedIn();
  const gradRef = await resolveGraduateRef(session.uid);
  if (!gradRef) return NextResponse.json({ memories: [] });
  const snap = await gradRef.collection('memories').orderBy('createdAt', 'desc').get();
  return NextResponse.json({
    memories: snap.docs.map((d) => ({ ...d.data(), id: d.id })),
  });
}

export async function POST(req: NextRequest) {
  const admin = getAdmin();
  if (!admin) return NextResponse.json({ ok: true, demo: true });
  const session = await requireSignedIn();
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const gradRef = await resolveGraduateRef(session.uid);
  if (!gradRef)
    return NextResponse.json({ error: 'No linked graduate' }, { status: 409 });

  const memRef = gradRef.collection('memories').doc();
  const doc = {
    ...parsed.data,
    id: memRef.id,
    createdAt: new Date().toISOString(),
  };
  await memRef.set(doc);
  return NextResponse.json({ ok: true, memory: doc });
}
