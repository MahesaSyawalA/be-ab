
import { randomUUID } from "node:crypto";
import path from "node:path";
import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { r2, R2_BUCKET, R2_PUBLIC_URL } from "./r2.ts";

const publicUrl = R2_PUBLIC_URL.replace(/\/+$/, "");

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

  const encodedKey = key
    .split("/")
    .map(encodeURIComponent)
    .join("/");

  return `${publicUrl}/${encodedKey}`;
}

export async function deleteFromR2(
  url?: string | null,
): Promise<void> {
  if (!url) return;

  let key: string;

  try {
    const parsedUrl = new URL(url);
    const baseUrl = new URL(publicUrl);

    if (parsedUrl.origin !== baseUrl.origin) return;
    if (!parsedUrl.pathname.startsWith(baseUrl.pathname.replace(/\/+$/, "") + "/")) return;

    key = decodeURIComponent(
      parsedUrl.pathname.slice(
        baseUrl.pathname.replace(/\/+$/, "").length + 1,
      ),
    );
  } catch {
    return;
  }

  if (!key) return;

  await r2.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    }),
  );
}
