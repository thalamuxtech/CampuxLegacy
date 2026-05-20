import { NextRequest, NextResponse } from 'next/server';
import { goodwillInputSchema } from '@/lib/types';
import { getAdmin } from '@/lib/firebase-admin';
import { addGoodwill } from '@/lib/admin-store';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = goodwillInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Always log into the in-memory moderation queue so demo mode keeps working.
  addGoodwill(parsed.data);

  const admin = getAdmin();
  if (!admin) {
    return NextResponse.json({ ok: true, demo: true });
  }

  // Canonical path: universities/{u}/classes/{c}/graduates/{g}/goodwills/{id}.
  // Resolve the graduate via collection-group lookup so the client only needs the id.
  const gradSnap = await admin.db
    .collectionGroup('graduates')
    .where('id', '==', parsed.data.graduateId)
    .limit(1)
    .get();
  if (gradSnap.empty) {
    return NextResponse.json({ error: 'Graduate not found' }, { status: 404 });
  }
  const gradRef = gradSnap.docs[0].ref;
  const flagged = /https?:\/\//i.test(parsed.data.message);
  const ref = gradRef.collection('goodwills').doc();
  await ref.set({
    ...parsed.data,
    approved: false,
    flagged,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, id: ref.id });
}
