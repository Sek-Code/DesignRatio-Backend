import multer from "multer";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_BYTES,
  },
  fileFilter: (req, file, cb) => {
    if (!file) return cb(null, false);

    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      const err = new Error("Only jpeg, png, webp files are allowed");
      err.status = 415;
      return cb(err);
    }

    return cb(null, true);
  },
});
