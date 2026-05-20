import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * Auto-moderation pass on goodwill creation:
 *  - flag empty / link-stuffed / abusive content
 *  - notify the graduate
 */
const BANNED = ['http://', 'https://', '<script', 'porn', 'casino'];

export const onGoodwillCreate = onDocumentCreated(
  'universities/{uniId}/classes/{classId}/graduates/{gradId}/goodwills/{id}',
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const data = snap.data();
    const lower = String(data.message ?? '').toLowerCase();
    const suspect = BANNED.some((b) => lower.includes(b));

    const db = getFirestore();
    await snap.ref.update({
      flagged: suspect,
      moderationStatus: suspect ? 'review' : 'auto-passed',
    });

    // Append to graduate's notification inbox
    const { uniId, classId, gradId } = event.params;
    const gradRef = db.doc(
      `universities/${uniId}/classes/${classId}/graduates/${gradId}`
    );
    const grad = await gradRef.get();
    const uid = grad.data()?.uid as string | undefined;
    if (uid) {
      await db.collection('users').doc(uid).collection('notifications').add({
        type: 'goodwill_received',
        from: data.fromName,
        message: data.message,
        read: false,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
  }
);
