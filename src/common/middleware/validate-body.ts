import type { RequestHandler } from "express";
import type { ZodType } from "zod";

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

export function validateBody(schema: ZodType): RequestHandler {
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

    req.body = result.data;
    next();
  };
}
