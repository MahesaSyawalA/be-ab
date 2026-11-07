import multer from "multer";

export const buktiKunjunganUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "image" && !file.mimetype.startsWith("image/")) {
      return cb(new Error("image must be an image file"));
    }
    cb(null, true);
  },
}).fields([
  { name: "img_url", maxCount: 1 },
  { name: "file_url", maxCount: 1 },
]);