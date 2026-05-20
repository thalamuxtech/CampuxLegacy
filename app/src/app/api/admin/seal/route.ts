import { NextRequest, NextResponse } from 'next/server';
import { adminStore } from '@/lib/admin-store';
import * as crypto from 'crypto';
import { z } from 'zod';

const schema = z.object({ classId: z.string() });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });

  const manifest = crypto
    .createHash('sha256')
    .update(parsed.data.classId + Date.now())
    .digest('hex');

  const s = adminStore();
  s.audit.unshift({
    id: `a-${Date.now()}`,
    type: 'class.sealed',
    actor: 'admin',
    detail: `Class ${parsed.data.classId} sealed (manifest: ${manifest.slice(0, 8)}…)`,
    at: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, manifest });
}
