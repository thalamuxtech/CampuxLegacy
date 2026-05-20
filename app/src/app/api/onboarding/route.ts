import { NextRequest, NextResponse } from 'next/server';
import { repSignupSchema } from '@/lib/types';
import { getAdmin } from '@/lib/firebase-admin';
import { addOnboarding } from '@/lib/admin-store';
import { z } from 'zod';

const fullSchema = repSignupSchema.extend({ notes: z.string().optional() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = fullSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }

  // Always log to admin store so demo + prod both work
  addOnboarding(parsed.data);

  const admin = getAdmin();
  if (admin) {
    const ref = admin.db.collection('onboardingRequests').doc();
    await ref.set({
      ...parsed.data,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
  }
  return NextResponse.json({ ok: true });
}
