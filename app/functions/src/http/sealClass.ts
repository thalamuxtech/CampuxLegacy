import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import * as crypto from 'crypto';

const input = z.object({ uniId: z.string(), classId: z.string() });

/**
 * Sealing job — admin-only. Snapshots every graduate in the class into an
 * immutable archive collection, writes a signed SHA-256 manifest, and flips
 * the class status to 'sealed'.
 */
export const sealClass = onCall({ region: 'us-central1' }, async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in required.');
  const roles = (req.auth.token.roles ?? {}) as Record<string, boolean>;
  if (!roles.university_admin && !roles.superadmin) {
    throw new HttpsError('permission-denied', 'Admin only.');
  }
  const { uniId, classId } = input.parse(req.data);
  const db = getFirestore();

  const gradsSnap = await db
    .collection(`universities/${uniId}/classes/${classId}/graduates`)
    .get();

  const hashes: string[] = [];
  const batch = db.batch();
  for (const doc of gradsSnap.docs) {
    const data = doc.data();
    if (data.status !== 'approved') {
      throw new HttpsError(
        'failed-precondition',
        `Graduate ${doc.id} not approved.`
      );
    }
    const archiveRef = db.doc(
      `universities/${uniId}/classes/${classId}/archive/${doc.id}`
    );
    const snapshot = {
      ...data,
      status: 'sealed',
      sealedAt: new Date().toISOString(),
    };
    batch.set(archiveRef, snapshot);
    batch.update(doc.ref, { status: 'sealed', sealedAt: snapshot.sealedAt });
    const hash = crypto
      .createHash('sha256')
      .update(JSON.stringify(snapshot))
      .digest('hex');
    hashes.push(`${doc.id}:${hash}`);
  }

  const manifest = crypto
    .createHash('sha256')
    .update(hashes.join('\n'))
    .digest('hex');

  batch.update(db.doc(`universities/${uniId}/classes/${classId}`), {
    status: 'sealed',
    sealedAt: FieldValue.serverTimestamp(),
    manifestSha256: manifest,
    sealedBy: req.auth.uid,
  });
  batch.set(db.collection('audit').doc(), {
    type: 'class.sealed',
    uniId,
    classId,
    by: req.auth.uid,
    count: gradsSnap.size,
    manifest,
    at: FieldValue.serverTimestamp(),
  });

  await batch.commit();
  return { ok: true, count: gradsSnap.size, manifest };
});
