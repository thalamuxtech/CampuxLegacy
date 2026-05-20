import { NextRequest, NextResponse } from 'next/server';
import { adminStore } from '@/lib/admin-store';
import { getAdmin } from '@/lib/firebase-admin';
import { getSession, isAdmin } from '@/lib/auth-server';
import * as crypto from 'crypto';
import { z } from 'zod';

const schema = z.object({
  classId: z.string(),
  uniId: z.string().optional(),
});

export async function POST(req: NextRequest) {
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

  // Real path: run the seal directly via Admin SDK (mirrors the sealClass callable
  // but skips the callable round-trip since we're already on the server with admin creds).
  const admin = getAdmin();
  if (admin && parsed.data.uniId && session) {
    const { uniId, classId } = parsed.data;
    const gradsSnap = await admin.db
      .collection(`universities/${uniId}/classes/${classId}/graduates`)
      .get();
    const hashes: string[] = [];
    const batch = admin.db.batch();
    for (const doc of gradsSnap.docs) {
      const data = doc.data();
      if (data.status !== 'approved') {
        return NextResponse.json(
          { error: `Graduate ${doc.id} is not approved.` },
          { status: 409 }
        );
      }
      const archiveRef = admin.db.doc(
        `universities/${uniId}/classes/${classId}/archive/${doc.id}`
      );
      const snapshot = {
        ...data,
        status: 'sealed',
        sealedAt: new Date().toISOString(),
      };
      batch.set(archiveRef, snapshot);
      batch.update(doc.ref, { status: 'sealed', sealedAt: snapshot.sealedAt });
      hashes.push(
        `${doc.id}:${crypto.createHash('sha256').update(JSON.stringify(snapshot)).digest('hex')}`
      );
    }
    const manifest = crypto.createHash('sha256').update(hashes.join('\n')).digest('hex');
    batch.update(admin.db.doc(`universities/${uniId}/classes/${classId}`), {
      status: 'sealed',
      sealedAt: new Date().toISOString(),
      manifestSha256: manifest,
      sealedBy: session.uid,
    });
    await batch.commit();
    await admin.db.collection('audit').add({
      type: 'class.sealed',
      uniId,
      classId,
      by: session.uid,
      count: gradsSnap.size,
      manifest,
      at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, count: gradsSnap.size, manifest });
  }

  // Demo path: fake the manifest into the in-memory audit log.
  const manifest = crypto
    .createHash('sha256')
    .update(parsed.data.classId + Date.now())
    .digest('hex');
  const s = adminStore();
  s.audit.unshift({
    id: `a-${Date.now()}`,
    type: 'class.sealed',
    actor: session?.email ?? 'demo',
    detail: `Class ${parsed.data.classId} sealed (manifest: ${manifest.slice(0, 8)}…)`,
    at: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, manifest, demo: true });
}
