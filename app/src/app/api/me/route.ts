import { NextRequest, NextResponse } from 'next/server';
import { requireSignedIn } from '@/lib/auth-server';
import { getAdmin } from '@/lib/firebase-admin';
import { z } from 'zod';

/**
 * GET /api/me
 * Returns the signed-in user's profile + linked graduate doc (or null).
 *
 * The user doc may carry:
 *   graduateRef: "universities/{u}/classes/{c}/graduates/{g}"
 * If absent, the user has not yet been linked to a graduate record.
 */
export async function GET() {
  const admin = getAdmin();
  if (!admin) {
    return NextResponse.json(
      { user: null, graduate: null, demo: true },
      { status: 200 }
    );
  }
  const session = await requireSignedIn();
  const userSnap = await admin.db.collection('users').doc(session.uid).get();
  const userData = userSnap.exists ? userSnap.data() : null;
  const ref = userData?.graduateRef as string | undefined;
  let graduate: unknown = null;
  let graduatePath: string | null = null;
  if (ref) {
    const gradSnap = await admin.db.doc(ref).get();
    if (gradSnap.exists) {
      graduate = { ...gradSnap.data(), id: gradSnap.id };
      graduatePath = ref;
    }
  }
  return NextResponse.json({
    user: userData,
    graduate,
    graduatePath,
  });
}

const patchSchema = z.object({
  preferredName: z.string().min(1).max(80).optional(),
  bio: z.string().max(600).optional(),
  quote: z.string().max(200).optional(),
  socials: z
    .object({
      instagram: z.string().max(60).optional(),
      linkedin: z.string().max(120).optional(),
      twitter: z.string().max(60).optional(),
    })
    .optional(),
  visibility: z
    .object({
      bio: z.enum(['public', 'connections', 'private']).optional(),
      contact: z.enum(['public', 'connections', 'private']).optional(),
      memories: z.enum(['public', 'connections', 'private']).optional(),
    })
    .optional(),
  submitForReview: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  const admin = getAdmin();
  if (!admin) {
    return NextResponse.json({ ok: true, demo: true });
  }
  const session = await requireSignedIn();
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const userSnap = await admin.db.collection('users').doc(session.uid).get();
  const ref = userSnap.data()?.graduateRef as string | undefined;
  if (!ref) {
    return NextResponse.json(
      { error: 'No linked graduate. Claim a profile first.' },
      { status: 409 }
    );
  }
  const gradRef = admin.db.doc(ref);
  const gradSnap = await gradRef.get();
  if (!gradSnap.exists) {
    return NextResponse.json({ error: 'Graduate doc missing' }, { status: 404 });
  }
  const current = gradSnap.data() ?? {};
  if (current.status === 'sealed') {
    return NextResponse.json(
      { error: 'This profile is sealed and immutable.' },
      { status: 409 }
    );
  }

  const update: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };
  if (parsed.data.preferredName !== undefined)
    update.preferredName = parsed.data.preferredName;
  if (parsed.data.bio !== undefined) update.bio = parsed.data.bio;
  if (parsed.data.quote !== undefined) update.quote = parsed.data.quote;
  if (parsed.data.socials)
    update.socials = { ...current.socials, ...parsed.data.socials };
  if (parsed.data.visibility)
    update.visibility = { ...current.visibility, ...parsed.data.visibility };
  if (parsed.data.submitForReview) update.status = 'pending_review';

  await gradRef.update(update);
  return NextResponse.json({ ok: true, status: update.status ?? current.status });
}
