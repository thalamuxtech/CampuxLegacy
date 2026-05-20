import { NextRequest, NextResponse } from 'next/server';
import { requireSignedIn } from '@/lib/auth-server';
import { getAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';

const schema = z.object({ graduateId: z.string().min(1) });

/**
 * POST /api/me/claim
 *
 * Body: { graduateId }
 *
 * Links the signed-in user to an existing graduate doc by writing
 * users/{uid}.graduateRef = "<nested path>" and stamping the graduate doc's
 * uid field. Also mints a custom claim graduateIds[gid]=true so storage rules
 * permit the user to upload their portrait.
 *
 * Only succeeds if the target graduate doc has no uid yet, OR the uid already
 * matches the signed-in user (idempotent).
 */
export async function POST(req: NextRequest) {
  const admin = getAdmin();
  if (!admin) {
    return NextResponse.json({ ok: true, demo: true });
  }
  const session = await requireSignedIn();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  }
  const { graduateId } = parsed.data;

  const snap = await admin.db
    .collectionGroup('graduates')
    .where('id', '==', graduateId)
    .limit(1)
    .get();
  if (snap.empty) {
    return NextResponse.json({ error: 'Graduate not found' }, { status: 404 });
  }
  const gradDoc = snap.docs[0];
  const data = gradDoc.data();
  if (data.uid && data.uid !== session.uid) {
    return NextResponse.json(
      { error: 'This profile has already been claimed.' },
      { status: 409 }
    );
  }

  await gradDoc.ref.update({ uid: session.uid, updatedAt: new Date().toISOString() });
  await admin.db
    .collection('users')
    .doc(session.uid)
    .set(
      { graduateRef: gradDoc.ref.path, updatedAt: new Date().toISOString() },
      { merge: true }
    );

  // Add the graduate id to the user's custom claims so storage rules permit
  // portrait upload. Existing claims are preserved.
  const user = await admin.auth.getUser(session.uid);
  const existing = (user.customClaims ?? {}) as {
    roles?: Record<string, boolean>;
    graduateIds?: Record<string, boolean>;
  };
  const graduateIds = { ...(existing.graduateIds ?? {}), [graduateId]: true };
  await admin.auth.setCustomUserClaims(session.uid, {
    ...existing,
    graduateIds,
  });

  return NextResponse.json({
    ok: true,
    graduatePath: gradDoc.ref.path,
    refreshIdToken: true,
  });
}
