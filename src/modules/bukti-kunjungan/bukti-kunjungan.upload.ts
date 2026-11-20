import multer from "multer";
import { HttpError } from "../../common/utils/http-error.ts";

export const buktiKunjunganUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "img_url" && !file.mimetype.startsWith("image/")) {
      return cb(new HttpError(400, "img_url harus berupa file gambar"));
    }
    cb(null, true);
  },
}).fields([
  { name: "img_url", maxCount: 1 },
  { name: "file_url", maxCount: 1 },
]);