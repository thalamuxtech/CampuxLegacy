import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import sharp from 'sharp';

/**
 * On portrait upload, generate AVIF + WebP variants at 320 / 640 / 1024 / 1600
 * and write paths back onto the nested graduate document at
 * universities/{u}/classes/{c}/graduates/{g}.
 *
 * The flat top-level graduates/{id} collection is not canonical — we resolve
 * the nested doc via a collection-group lookup on the graduate's `id` field.
 */
export const onPortraitUpload = onObjectFinalized(
  { region: 'us-central1', memory: '1GiB', timeoutSeconds: 120 },
  async (event) => {
    const filePath = event.data.name;
    if (!filePath) return;
    const match = filePath.match(/^graduates\/([^/]+)\/portrait\/original$/);
    if (!match) return;
    const graduateId = match[1];

    const bucket = getStorage().bucket(event.data.bucket);
    const tmp = path.join(os.tmpdir(), `portrait-${Date.now()}`);
    await bucket.file(filePath).download({ destination: tmp });

    const sizes = [320, 640, 1024, 1600];
    const formats: Array<'avif' | 'webp'> = ['avif', 'webp'];
    const variantPaths: Record<string, string> = {};

    for (const size of sizes) {
      for (const fmt of formats) {
        const out = `${tmp}-${size}.${fmt}`;
        const pipeline = sharp(tmp)
          .rotate()
          .resize(size, size, { fit: 'cover', position: 'attention' })
          .withMetadata({});
        await (fmt === 'avif'
          ? pipeline.avif({ quality: 60 })
          : pipeline.webp({ quality: 70 })
        ).toFile(out);

        const dest = `graduates/${graduateId}/portrait/variants/${size}.${fmt}`;
        await bucket.upload(out, {
          destination: dest,
          metadata: { cacheControl: 'public,max-age=31536000,immutable' },
        });
        variantPaths[`${size}_${fmt}`] =
          `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(dest)}?alt=media`;
        fs.unlinkSync(out);
      }
    }
    fs.unlinkSync(tmp);

    const db = getFirestore();
    const update = {
      portrait: {
        variants: variantPaths,
        processedAt: new Date().toISOString(),
      },
    };

    const gradSnap = await db
      .collectionGroup('graduates')
      .where('id', '==', graduateId)
      .limit(1)
      .get();
    if (!gradSnap.empty) {
      await gradSnap.docs[0].ref.set(update, { merge: true });
    } else {
      // Fallback: write a stub at top-level so the variants aren't lost even
      // if the nested doc isn't created yet. The graduate doc owner can copy.
      await db
        .collection('graduates_orphan_portraits')
        .doc(graduateId)
        .set(update, { merge: true });
    }
  }
);
