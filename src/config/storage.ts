import { randomUUID } from "node:crypto";
import path from "node:path";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "./r2.ts";

export async function uploadToR2(
  file: Express.Multer.File,
  folder: string,
): Promise<string> {
  const ext = path.extname(file.originalname).toLowerCase();
  const key = `${folder}/${randomUUID()}${ext}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return `${R2_PUBLIC_URL}/${key}`;
}

export async function deleteFromR2(url?: string | null): Promise<void> {
  if (!url || !url.startsWith(R2_PUBLIC_URL)) return;
  const key = url.slice(R2_PUBLIC_URL.length + 1);
  await r2.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: key }));
}