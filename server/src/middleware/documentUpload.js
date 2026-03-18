import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

/* ── Cloudinary Config ── */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ── Allowed file types ── */
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".doc", ".docx"];

/* ── Cloudinary Storage ── */
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Use 'raw' resource type for PDFs and docs (not 'image')
    const resourceType =
      file.mimetype === "application/pdf" ||
      file.mimetype.includes("word") ||
      file.mimetype.includes("document")
        ? "raw"
        : "image";

    return {
      folder:        `raazimarzi/cases/${req.body.caseId || "general"}`,
      resource_type: resourceType,
      public_id:     `doc_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      // Raw files (PDF/docs) don't support transformation
      ...(resourceType === "image" && {
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      }),
    };
  },
});

/* ── File Filter ── */
const fileFilter = (req, file, cb) => {
  const ext  = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (ALLOWED_MIME_TYPES.includes(mime) && ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type. Allowed: PDF, JPG, PNG, WEBP, DOC, DOCX. Got: ${ext}`
      ),
      false
    );
  }
};

/* ── Multer Instance ── */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

export default upload;
export { cloudinary };