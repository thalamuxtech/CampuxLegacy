import { NextRequest, NextResponse } from 'next/server';
import { updateOnboardingStatus } from '@/lib/admin-store';
import { updateOnboardingDoc } from '@/lib/firestore-server';
import { getSession, isAdmin } from '@/lib/auth-server';
import { getAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';

const schema = z.object({
  status: z.enum(['pending', 'in_review', 'approved', 'rejected']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminConfigured = Boolean(getAdmin());
  const session = await getSession();
  if (adminConfigured) {
    if (!session) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    if (!isAdmin(session)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const item = updateOnboardingStatus(params.id, parsed.data.status);
  if (adminConfigured && session) {
    await updateOnboardingDoc(params.id, parsed.data.status, session.uid);
  }
  if (!item && !adminConfigured)
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}
