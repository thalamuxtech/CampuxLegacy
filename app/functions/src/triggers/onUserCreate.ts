import { auth } from 'firebase-functions/v1';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * Bootstraps users/{uid} when a new Firebase Auth user signs up.
 * New users start with role 'visitor' until claimed via invite or admin promotion.
 */
export const onUserCreate = auth.user().onCreate(async (user) => {
  const db = getFirestore();
  await db
    .collection('users')
    .doc(user.uid)
    .set(
      {
        uid: user.uid,
        email: user.email ?? null,
        displayName: user.displayName ?? null,
        photoURL: user.photoURL ?? null,
        roles: { student: true },
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
});
