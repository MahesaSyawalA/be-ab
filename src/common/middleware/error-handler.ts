import type { ErrorRequestHandler } from "express";
import { HttpError } from "../utils/http-error.ts";

function readStatus(error: unknown): number | null {
  if (typeof error !== "object" || error === null) return null;

  const candidate = error as { status?: unknown; statusCode?: unknown };
  const status = candidate.status ?? candidate.statusCode;

  return typeof status === "number" && status >= 400 && status < 600 ? status : null;
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  // Error dari framework (mis. body-parser saat JSON tidak valid) sudah membawa
  // status yang tepat. Tanpa ini, request dengan body rusak akan dibalas 500.
  const status = readStatus(error);
  if (status !== null && status < 500) {
    res.status(status).json({
      message: error instanceof Error ? error.message : "Permintaan tidak valid.",
    });
    return;
  }

  console.error("[error]", error);
  res.status(500).json({ message: "Terjadi kesalahan pada server." });
};
