import type { Request, RequestHandler } from "express";
import type { ZodType } from "zod";

export interface ValidateBodyOptions {
  /**
   * Wajibkan minimal satu field pada body (setelah validasi) atau minimal satu
   * file yang diunggah (`req.file` / `req.files`). Berguna untuk endpoint
   * PUT/PATCH multipart agar request kosong (`{}` tanpa file) tetap ditolak.
   */
  requireBodyOrFile?: boolean;
}

function hasUploadedFile(req: Request): boolean {
  if (req.file) return true;
  if (!req.files) return false;
  if (Array.isArray(req.files)) {
    return req.files.length > 0;
  }
  return Object.values(req.files).some(
    (files) => Array.isArray(files) && files.length > 0
  );
}

function hasDefinedBodyField(data: unknown): boolean {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    return false;
  }
  return Object.values(data as Record<string, unknown>).some(
    (value) => value !== undefined
  );
}

function formatFieldLabel(path: readonly PropertyKey[]): string {
  const joined = path.map((segment) => String(segment)).join(".");
  if (!joined) return "Field";
  return joined.replace(/_/g, " ");
}

function normalizeIssueMessage(
  path: readonly PropertyKey[],
  message: string
): string {
  if (/expected .+, received undefined/i.test(message)) {
    const label = formatFieldLabel(path);
    return `${label.charAt(0).toUpperCase()}${label.slice(1)} wajib diisi`;
  }
  return message;
}

export function validateBody(
  schema: ZodType,
  options: ValidateBodyOptions = {}
): RequestHandler {
  return (req, res, next) => {
    const rawBody =
      req.body !== null &&
      typeof req.body === "object" &&
      !Array.isArray(req.body)
        ? req.body
        : {};

    const result = schema.safeParse(rawBody);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => {
        const field = issue.path.map((segment) => String(segment)).join(".");
        return {
          ...issue,
          field: field || undefined,
          message: normalizeIssueMessage(issue.path, issue.message),
        };
      });

      res.status(400).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
      return;
    }

    if (
      options.requireBodyOrFile &&
      !hasDefinedBodyField(result.data) &&
      !hasUploadedFile(req)
    ) {
      res.status(400).json({
        message: "Validation failed",
        errors: [
          {
            message: "Minimal satu field atau file harus diisi untuk pembaruan data",
          },
        ],
      });
      return;
    }

    req.body = result.data;
    next();
  };
}
