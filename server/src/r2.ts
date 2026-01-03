
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME;
const PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL; // e.g., https://pub-xyz.r2.dev

let r2: S3Client | null = null;

export function getR2Client() {
    if (r2) return r2;

    if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET_NAME) {
        console.warn('R2 credentials missing. R2 uploads will fail.');
        return null;
    }

    r2 = new S3Client({
        region: 'auto',
        endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY,
        },
    });

    return r2;
}

export async function uploadBufferToR2({
    key,
    buffer,
    contentType,
}: {
    key: string;
    buffer: Buffer;
    contentType: string;
}): Promise<{ url: string; key: string }> {
    const client = getR2Client();
    if (!client) {
        throw new Error('R2 client not configured');
    }

    // Ensure Public Read URL is set
    if (!PUBLIC_BASE_URL) {
        throw new Error('R2_PUBLIC_BASE_URL is not set');
    }

    await client.send(
        new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: contentType,
            // ACL: 'public-read', // R2 doesn't always strictly need ACL if bucket is public, but good to check
        })
    );

    const url = `${PUBLIC_BASE_URL.replace(/\/$/, '')}/${key}`;
    return { url, key };
}

export function generateR2Key(prefix: string, ext: string): string {
    const unique = crypto.randomUUID().slice(0, 8);
    const date = new Date().toISOString().split('T')[0];
    return `${prefix}/${date}-${unique}${ext}`;
}
