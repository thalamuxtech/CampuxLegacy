import { NextRequest, NextResponse } from 'next/server';
import { updateOnboardingStatus } from '@/lib/admin-store';
import { z } from 'zod';

const schema = z.object({
  status: z.enum(['pending', 'in_review', 'approved', 'rejected']),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const item = updateOnboardingStatus(params.id, parsed.data.status);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true, item });
}
