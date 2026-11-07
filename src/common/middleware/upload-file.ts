import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { HttpError } from "../utils/http-error.ts";

export const MAX_UPLOAD_SIZE = 25 * 1024 * 1024; // 25 MB

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_UPLOAD_SIZE, files: 1 },
});

export const uploadSingle = (field: string) => (req: Request, res: Response, next: NextFunction) => {
    upload.single(field)(req, res, (error: unknown) => {
        if (!error) return next();

        if (error instanceof multer.MulterError) {
            if (error.code === "LIMIT_FILE_SIZE") {
                return next(new HttpError(413, "Ukuran file maksimal 25 MB."));
            }
            return next(new HttpError(400, error.message));
        }
        next(error);
    });
};