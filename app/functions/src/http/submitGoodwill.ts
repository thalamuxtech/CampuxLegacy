import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';

const input = z.object({
  uniId: z.string(),
  classId: z.string(),
  gradId: z.string(),
  fromName: z.string().min(2).max(60),
  fromRelation: z.string().max(40).optional(),
  message: z.string().min(8).max(400),
});

/**
 * Public goodwill submission with rate-limiting (per IP, per minute).
 */
const recent = new Map<string, number[]>();

export const submitGoodwill = onCall({ region: 'us-central1' }, async (req) => {
  const data = input.parse(req.data);
  const ip = req.rawRequest.ip ?? 'unknown';
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60_000);
  if (hits.length >= 5) {
    throw new HttpsError('resource-exhausted', 'Please slow down.');
  }
  recent.set(ip, [...hits, now]);

  const db = getFirestore();
  const ref = db
    .collection(
      `universities/${data.uniId}/classes/${data.classId}/graduates/${data.gradId}/goodwills`
    )
    .doc();
  await ref.set({
    ...data,
    approved: false,
    createdAt: FieldValue.serverTimestamp(),
  });
  return { ok: true, id: ref.id };
});
