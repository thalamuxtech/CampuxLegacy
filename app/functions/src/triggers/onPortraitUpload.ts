import { onObjectFinalized } from 'firebase-functions/v2/storage';
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import sharp from 'sharp';

/**
 * On portrait upload, generate AVIF + WebP variants at 320 / 640 / 1024 / 1600
 * and write paths back onto the graduate document.
 */
export const onPortraitUpload = onObjectFinalized(
  { region: 'us-central1', memory: '1GiB', timeoutSeconds: 120 },
  async (event) => {
    const filePath = event.data.name;
    if (!filePath) return;
    if (!filePath.match(/^graduates\/([^/]+)\/portrait\/original$/)) return;

    const match = filePath.match(/^graduates\/([^/]+)\/portrait\/original$/);
    const graduateId = match![1];

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
    await db.collection('graduates').doc(graduateId).set(
      {
        portrait: { variants: variantPaths, processedAt: new Date().toISOString() },
      },
      { merge: true }
    );
  }
);
