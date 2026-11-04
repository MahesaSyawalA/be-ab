import type { RequestHandler } from "express";
import { COOKIE_NAMES } from "../../config/auth.ts";
import { authService } from "../../modules/auth/auth.service.ts";
import { parseCookies } from "../utils/cookies.ts";
import { HttpError } from "../utils/http-error.ts";

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    let token = parseCookies(req.headers.cookie)[COOKIE_NAMES.access];

    if (token === undefined && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      }
    }

    if (token === undefined) {
      throw new HttpError(401, "Tidak terautentikasi.");
    }

    req.user = await authService.verifyAccessToken(token);
    next();
  } catch (error) {
    next(error);
  }
};
