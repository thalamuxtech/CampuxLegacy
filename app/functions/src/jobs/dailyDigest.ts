import { onSchedule } from 'firebase-functions/v2/scheduler';
import { getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';

/**
 * Daily 06:00 Africa/Lagos — aggregate pending-review counts per university
 * so reps know what's waiting for them. In production, hand off to SendGrid.
 */
export const dailyDigest = onSchedule(
  { schedule: '0 6 * * *', timeZone: 'Africa/Lagos', region: 'us-central1' },
  async () => {
    const db = getFirestore();
    const unis = await db.collection('universities').get();
    for (const uni of unis.docs) {
      const pending = await db
        .collectionGroup('graduates')
        .where('universityId', '==', uni.id)
        .where('status', '==', 'pending_review')
        .count()
        .get();
      logger.info(
        `digest: ${uni.id} has ${pending.data().count} graduates pending review.`
      );
      // TODO: send to SendGrid using rep email list from uni.contacts
    }
  }
);
