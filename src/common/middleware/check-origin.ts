import type { RequestHandler } from "express";
import { env } from "../../config/env.ts";
import { HttpError } from "../utils/http-error.ts";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Pertahanan CSRF murah di atas `sameSite=lax`: request mutasi yang membawa
 * header `Origin` wajib berasal dari origin yang diizinkan.
 *
 * Request tanpa `Origin` (curl, server-to-server) dilewatkan, karena browser
 * selalu mengirim `Origin` pada request lintas-origin.
 */
export const checkOrigin: RequestHandler = (req, _res, next) => {
  if (!MUTATING_METHODS.has(req.method)) {
    next();
    return;
  }

  const origin = req.headers.origin;
  if (origin === undefined) {
    next();
    return;
  }

  if (env.corsOrigins.includes(origin)) {
    next();
    return;
  }

  next(new HttpError(403, "Origin tidak diizinkan."));
};
