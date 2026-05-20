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

  // Always log into admin moderation queue
  addGoodwill(parsed.data);

  const admin = getAdmin();
  if (!admin) {
    return NextResponse.json({ ok: true, demo: true });
  }

  const ref = admin.db
    .collection('graduates')
    .doc(parsed.data.graduateId)
    .collection('goodwills')
    .doc();
  await ref.set({
    ...parsed.data,
    approved: false,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, id: ref.id });
}
