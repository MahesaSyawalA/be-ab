import type { RequestHandler } from "express";
import multer from "multer";
import { HttpError } from "../../common/utils/http-error.ts";
import {
  isSafeDocumentFile,
  isSafeImageFile,
} from "../../common/utils/validation.ts";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "img_url") {
      if (!isSafeImageFile(file.mimetype, file.originalname)) {
        return cb(
          new HttpError(
            400,
            "img_url harus berupa gambar JPG, PNG, WebP, atau GIF (SVG tidak diperbolehkan)."
          )
        );
      }
    } else if (file.fieldname === "file_url") {
      if (
        !isSafeDocumentFile(file.mimetype, file.originalname) &&
        !isSafeImageFile(file.mimetype, file.originalname)
      ) {
        return cb(
          new HttpError(
            400,
            "Format file lampiran tidak diperbolehkan. Gunakan PDF, Office, CSV, TXT, atau gambar JPG/PNG/WebP."
          )
        );
      }
    }
    cb(null, true);
  },
}).fields([
  { name: "img_url", maxCount: 1 },
  { name: "file_url", maxCount: 1 },
]);

export const buktiKunjunganUpload: RequestHandler = (req, res, next) => {
  upload(req, res, (err: unknown) => {
    if (!err) {
      next();
      return;
    }
    if (err instanceof HttpError) {
      next(err);
      return;
    }
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        next(new HttpError(400, "Ukuran file maksimal 10 MB."));
        return;
      }
      next(new HttpError(400, `Upload gagal: ${err.message}`));
      return;
    }
    next(err);
  });
};
