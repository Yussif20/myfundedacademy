import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";
import { generateRandomToken } from "@/utils/tokens";

let cachedClient: S3Client | null = null;

const getClient = (): S3Client => {
  if (cachedClient) return cachedClient;
  if (!env.S3_ACCESS_KEY || !env.S3_SECRET_KEY || !env.S3_ENDPOINT) {
    throw new Error("S3/R2 credentials are not configured.");
  }
  cachedClient = new S3Client({
    region: env.S3_REGION || "auto",
    endpoint: env.S3_ENDPOINT,
    credentials: {
      accessKeyId: env.S3_ACCESS_KEY,
      secretAccessKey: env.S3_SECRET_KEY,
    },
    forcePathStyle: true,
    // R2 / non-AWS S3 services reject the auto-added x-amz-checksum-crc32
    // params that AWS SDK v3 enables by default. WHEN_REQUIRED skips them.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return cachedClient;
};

export const isStorageConfigured = (): boolean =>
  Boolean(env.S3_ACCESS_KEY && env.S3_SECRET_KEY && env.S3_ENDPOINT && env.S3_BUCKET);

const sanitizeName = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

/** Builds an opaque, hard-to-guess object key under a folder. */
export const buildObjectKey = (folder: string, originalName: string): string => {
  const safe = sanitizeName(originalName);
  return `${folder}/${generateRandomToken(12)}-${safe}`;
};

/** Public URL for an object — only meaningful when the bucket has the public dev URL enabled. */
export const publicUrlForKey = (key: string): string => {
  if (!env.S3_PUBLIC_URL) return "";
  const trimmed = env.S3_PUBLIC_URL.replace(/\/+$/, "");
  return `${trimmed}/${key}`;
};

/**
 * Returns a short-lived presigned PUT URL that the browser uses to upload
 * directly to R2. Server never sees the file bytes.
 */
export const presignUpload = async (params: {
  key: string;
  contentType: string;
  contentLength?: number;
  expiresInSeconds?: number;
}): Promise<string> => {
  const client = getClient();
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: params.key,
    ContentType: params.contentType,
    ...(params.contentLength ? { ContentLength: params.contentLength } : {}),
  });
  return getSignedUrl(client, command, { expiresIn: params.expiresInSeconds ?? 600 });
};

export const deleteObject = async (key: string): Promise<void> => {
  if (!key) return;
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
    }),
  );
};
