import type { RequestHandler } from "express";
import type { UserRole } from "../../modules/users/users.types.ts";
import { HttpError } from "../utils/http-error.ts";

export function requireRole(...allowedRoles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return next(new HttpError(401, "Tidak terautentikasi."));
    }

    if (!allowedRoles.includes(userRole)) {
      return next(
        new HttpError(403, "Akses ditolak. Anda tidak memiliki izin untuk melakukan tindakan ini.")
      );
    }

    next();
  };
}

