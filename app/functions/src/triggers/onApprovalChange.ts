import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * When a graduate doc's status flips to 'approved', log audit + bump
 * the class's published counter.
 */
export const onApprovalChange = onDocumentWritten(
  'universities/{uniId}/classes/{classId}/graduates/{gradId}',
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (!after) return;
    if (before?.status === after.status) return;

    const db = getFirestore();
    await db.collection('audit').add({
      type: 'graduate.status_change',
      uniId: event.params.uniId,
      classId: event.params.classId,
      gradId: event.params.gradId,
      from: before?.status ?? null,
      to: after.status,
      at: FieldValue.serverTimestamp(),
    });

    if (after.status === 'approved' && before?.status !== 'approved') {
      const classRef = db.doc(
        `universities/${event.params.uniId}/classes/${event.params.classId}`
      );
      await classRef.update({
        graduatesCount: FieldValue.increment(1),
      });
    }
  }
);
