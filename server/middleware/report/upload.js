import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Multer upload middleware for report images.
 *
 * - Saves to server/uploads/
 * - Accepts up to 3 images per report
 * - Max 5MB per file
 * - Only jpeg, png, webp allowed
 *
 * Assumption: 3 images × 5MB max is reasonable for a waste report.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    // Prefix with timestamp to avoid collisions
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed."), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
