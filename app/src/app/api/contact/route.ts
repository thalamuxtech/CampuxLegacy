import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addContact } from '@/lib/admin-store';
import { getAdmin } from '@/lib/firebase-admin';

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  subject: z.string().min(2).max(120),
  message: z.string().min(8).max(2000),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  addContact(parsed.data);

  const admin = getAdmin();
  if (admin) {
    await admin.db.collection('contacts').add({
      ...parsed.data,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }
  return NextResponse.json({ ok: true });
}
