import { NextRequest, NextResponse } from 'next/server';
import { approveGoodwill, rejectGoodwill } from '@/lib/admin-store';

export async function PATCH(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const item = approveGoodwill(params.id);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  rejectGoodwill(params.id);
  return NextResponse.json({ ok: true });
}
