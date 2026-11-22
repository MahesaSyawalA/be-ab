import path from "node:path";
import { z } from "zod";

const DANGEROUS_HTML_REGEX =
  /<\s*\/?\s*(script|iframe|object|embed|svg|style|link|meta|form|base|applet|body|html)\b|on[a-z]+\s*=|javascript\s*:|vbscript\s*:|data\s*:\s*text\/html/i;

// Karakter tak terlihat / zero-width / blank filler yang tidak dibersihkan oleh .trim() standar
const INVISIBLE_CHARS_REGEX =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2800\u3164\uFEFF\uFFA0]/g;

export function stripInvisibleChars(value: string): string {
  return value.replace(INVISIBLE_CHARS_REGEX, "").trim();
}

function preprocessTextInput(val: unknown): unknown {
  if (typeof val === "string") {
    return stripInvisibleChars(val);
  }
  return val;
}

function preprocessOptionalTextInput(val: unknown): unknown {
  if (val === undefined) return undefined;
  if (typeof val === "string") {
    const cleaned = stripInvisibleChars(val);
    return cleaned === "" ? undefined : cleaned;
  }
  return val;
}

export function hasDangerousXssPattern(value: string): boolean {
  return DANGEROUS_HTML_REGEX.test(value);
}

const xssErrorMessage = (label: string) =>
  `${label} mengandung karakter atau skrip yang tidak diperbolehkan`;

export function requiredString(
  label: string,
  maxLength?: number,
  minLength = 1
) {
  let schema = z
    .string({ error: `${label} wajib diisi` })
    .trim()
    .min(minLength, {
      message:
        minLength === 1
          ? `${label} wajib diisi`
          : `${label} minimal ${minLength} karakter`,
    });

  if (maxLength !== undefined) {
    schema = schema.max(maxLength, {
      message: `${label} maksimal ${maxLength} karakter`,
    });
  }

  return z.preprocess(
    preprocessTextInput,
    schema.refine((val) => !hasDangerousXssPattern(val), {
      message: xssErrorMessage(label),
    })
  );
}

export function optionalString(label: string, maxLength?: number) {
  let schema = z.string({ error: `${label} harus berupa teks` }).trim();

  if (maxLength !== undefined) {
    schema = schema.max(maxLength, {
      message: `${label} maksimal ${maxLength} karakter`,
    });
  }

  return z.preprocess(
    preprocessOptionalTextInput,
    schema
      .refine((val) => !hasDangerousXssPattern(val), {
        message: xssErrorMessage(label),
      })
      .optional()
  );
}

export function requiredEmail(label = "Email", maxLength = 150) {
  return z.preprocess(
    preprocessTextInput,
    z
      .string({ error: `${label} wajib diisi` })
      .trim()
      .min(1, { message: `${label} wajib diisi` })
      .max(maxLength, { message: `${label} maksimal ${maxLength} karakter` })
      .email({ message: `Format ${label.toLowerCase()} tidak valid` })
  );
}

export function isSafeHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function safeHttpUrl(label: string, maxLength = 500) {
  return z.preprocess(
    preprocessTextInput,
    z
      .string({ error: `${label} wajib diisi` })
      .trim()
      .min(1, { message: `${label} wajib diisi` })
      .max(maxLength, { message: `${label} maksimal ${maxLength} karakter` })
      .refine(isSafeHttpUrl, {
        message: `${label} harus berupa URL http/https yang valid`,
      })
  );
}

export function optionalSafeHttpUrl(label: string, maxLength = 500) {
  return z.preprocess(
    preprocessOptionalTextInput,
    z
      .string({ error: `${label} harus berupa teks` })
      .trim()
      .max(maxLength, { message: `${label} maksimal ${maxLength} karakter` })
      .refine(isSafeHttpUrl, {
        message: `${label} harus berupa URL http/https yang valid`,
      })
      .optional()
  );
}

function preprocessNumberInput(val: unknown): unknown {
  if (val === undefined || val === null) return undefined;
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed === "") return undefined;
    const num = Number(trimmed);
    return Number.isNaN(num) ? val : num;
  }
  return val;
}

export interface NumberOptions {
  min?: number;
  max?: number;
  int?: boolean;
}

export function requiredNumber(label: string, opts: NumberOptions = {}) {
  let numSchema = z.number({
    error: (issue) =>
      issue.input === undefined
        ? `${label} wajib diisi`
        : `${label} harus berupa angka yang valid`,
  });

  if (opts.int) {
    numSchema = numSchema.int({ message: `${label} harus berupa bilangan bulat` });
  }
  if (opts.min !== undefined) {
    numSchema = numSchema.min(opts.min, {
      message: `${label} minimal ${opts.min}`,
    });
  }
  if (opts.max !== undefined) {
    numSchema = numSchema.max(opts.max, {
      message: `${label} maksimal ${opts.max}`,
    });
  }

  return z.preprocess(preprocessNumberInput, numSchema);
}

export function optionalNumber(label: string, opts: NumberOptions = {}) {
  let numSchema = z.number({
    error: `${label} harus berupa angka yang valid`,
  });

  if (opts.int) {
    numSchema = numSchema.int({ message: `${label} harus berupa bilangan bulat` });
  }
  if (opts.min !== undefined) {
    numSchema = numSchema.min(opts.min, {
      message: `${label} minimal ${opts.min}`,
    });
  }
  if (opts.max !== undefined) {
    numSchema = numSchema.max(opts.max, {
      message: `${label} maksimal ${opts.max}`,
    });
  }

  return z.preprocess(preprocessNumberInput, numSchema.optional());
}

function isValidDateString(val: string): boolean {
  if (val.trim() === "") return false;
  return !Number.isNaN(Date.parse(val));
}

export function requiredIsoDate(label: string) {
  return z.preprocess(
    preprocessTextInput,
    z
      .string({ error: `${label} wajib diisi` })
      .trim()
      .min(1, { message: `${label} wajib diisi` })
      .max(50, { message: `${label} tidak valid` })
      .refine(isValidDateString, {
        message: `Format ${label.toLowerCase()} tidak valid`,
      })
  );
}

export function optionalIsoDate(label: string) {
  return z.preprocess(
    preprocessOptionalTextInput,
    z
      .string({ error: `${label} harus berupa teks tanggal` })
      .trim()
      .max(50, { message: `${label} tidak valid` })
      .refine(isValidDateString, {
        message: `Format ${label.toLowerCase()} tidak valid`,
      })
      .optional()
  );
}

export function nonEmptyUpdate<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) {
  return schema.refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    {
      message: "Minimal satu field harus diisi untuk pembaruan data",
    }
  );
}

// ============================================================================
// File Upload Security Allowlists (No SVG / HTML / JS / Executables)
// ============================================================================

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const ALLOWED_IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
]);

export const ALLOWED_DOCUMENT_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
]);

export const ALLOWED_DOCUMENT_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".txt",
  ".csv",
]);

export const ALLOWED_AUDIO_MIME_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/ogg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
  "audio/webm",
]);

export const ALLOWED_AUDIO_EXTENSIONS = new Set([
  ".mp3",
  ".wav",
  ".ogg",
  ".m4a",
  ".aac",
  ".webm",
]);

export const ALLOWED_VIDEO_MIME_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
]);

export const ALLOWED_VIDEO_EXTENSIONS = new Set([
  ".mp4",
  ".webm",
  ".mov",
  ".avi",
  ".mkv",
]);

function getLowerExt(originalname: string): string {
  return path.extname(originalname || "").toLowerCase();
}

export function isSafeImageFile(mimetype: string, originalname: string): boolean {
  const mime = (mimetype || "").toLowerCase();
  const ext = getLowerExt(originalname);
  return (
    ALLOWED_IMAGE_MIME_TYPES.has(mime) &&
    (ext === "" || ALLOWED_IMAGE_EXTENSIONS.has(ext))
  );
}

export function isSafeDocumentFile(
  mimetype: string,
  originalname: string
): boolean {
  const mime = (mimetype || "").toLowerCase();
  const ext = getLowerExt(originalname);
  return (
    ALLOWED_DOCUMENT_MIME_TYPES.has(mime) &&
    (ext === "" || ALLOWED_DOCUMENT_EXTENSIONS.has(ext))
  );
}

export function isSafeAudioFile(mimetype: string, originalname: string): boolean {
  const mime = (mimetype || "").toLowerCase();
  const ext = getLowerExt(originalname);
  return (
    ALLOWED_AUDIO_MIME_TYPES.has(mime) &&
    (ext === "" || ALLOWED_AUDIO_EXTENSIONS.has(ext))
  );
}

export function isSafeVideoFile(mimetype: string, originalname: string): boolean {
  const mime = (mimetype || "").toLowerCase();
  const ext = getLowerExt(originalname);
  return (
    ALLOWED_VIDEO_MIME_TYPES.has(mime) &&
    (ext === "" || ALLOWED_VIDEO_EXTENSIONS.has(ext))
  );
}

export function sanitizeFilename(filename: string, maxLength = 255): string {
  return (filename || "file")
    .replace(/[\u0000-\u001F\u007F<>:"/\\|?*]/g, "")
    .trim()
    .slice(0, maxLength);
}
