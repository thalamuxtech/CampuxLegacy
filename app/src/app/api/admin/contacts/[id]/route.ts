import { NextRequest, NextResponse } from 'next/server';
import { deleteContact, markContactRead } from '@/lib/admin-store';
import { z } from 'zod';

const schema = z.object({ read: z.boolean() });

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  markContactRead(params.id, parsed.data.read);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  deleteContact(params.id);
  return NextResponse.json({ ok: true });
}
