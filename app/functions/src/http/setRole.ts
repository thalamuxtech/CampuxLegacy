import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { getAuth } from 'firebase-admin/auth';
import { z } from 'zod';

const input = z.object({
  uid: z.string(),
  role: z.enum(['student', 'rep', 'university_admin', 'official', 'superadmin']),
  enabled: z.boolean(),
});

/** Superadmin-only role grant. Writes Firebase Auth custom claims. */
export const setRole = onCall({ region: 'us-central1' }, async (req) => {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in required.');
  const callerRoles = (req.auth.token.roles ?? {}) as Record<string, boolean>;
  if (!callerRoles.superadmin) {
    throw new HttpsError('permission-denied', 'Superadmin only.');
  }
  const { uid, role, enabled } = input.parse(req.data);
  const user = await getAuth().getUser(uid);
  const roles = { ...((user.customClaims?.roles as object) ?? {}) } as Record<
    string,
    boolean
  >;
  if (enabled) roles[role] = true;
  else delete roles[role];
  await getAuth().setCustomUserClaims(uid, { roles });
  return { ok: true, roles };
});
