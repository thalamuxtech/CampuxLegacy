import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '@/lib/firebase-admin';

const COOKIE = '__session';
const EXPIRES_DAYS = Number(process.env.SESSION_COOKIE_DAYS ?? 5);
const EXPIRES_MS = EXPIRES_DAYS * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  const admin = getAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: 'Firebase Admin not configured' },
      { status: 503 }
    );
  }
  const { idToken } = await req.json().catch(() => ({ idToken: null }));
  if (typeof idToken !== 'string' || !idToken) {
    return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
  }
  try {
    const cookie = await admin.auth.createSessionCookie(idToken, {
      expiresIn: EXPIRES_MS,
    });
    cookies().set(COOKIE, cookie, {
      maxAge: EXPIRES_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid ID token', detail: String(err) },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const cookie = cookies().get(COOKIE)?.value;
  cookies().delete(COOKIE);
  const admin = getAdmin();
  if (admin && cookie) {
    try {
      const decoded = await admin.auth.verifySessionCookie(cookie);
      await admin.auth.revokeRefreshTokens(decoded.uid);
    } catch {
      /* ignore */
    }
  }
  return NextResponse.json({ ok: true });
}
