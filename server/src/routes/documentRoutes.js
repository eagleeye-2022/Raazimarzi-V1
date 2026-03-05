import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/documentUpload.js";
import {
  uploadDocument,
  getAllDocuments,
  getDocumentsByCase,
  getDocumentById,
  downloadDocument,
  updateDocument,
  deleteDocument,
  approveDocument,
  rejectDocument,
} from "../controllers/documentController.js";

const router = express.Router();

const adminOnly = [protect, authorizeRoles(["admin"])];
const adminOrManager = [protect, authorizeRoles(["admin", "case-manager"])];

/* ─ Specific string routes FIRST (prevent /:id from swallowing them) ─ */
router.post("/upload", protect, upload.single("document"), uploadDocument);
router.get("/all", ...adminOnly, getAllDocuments);
router.get("/case/:caseId", protect, getDocumentsByCase);

/* ─ Param routes LAST ─ */
router.get("/:id", protect, getDocumentById);
router.get("/:id/download", protect, downloadDocument);
router.put("/:id", protect, updateDocument);
router.delete("/:id", protect, deleteDocument);
router.patch("/:id/approve", ...adminOrManager, approveDocument);
router.patch("/:id/reject", ...adminOrManager, rejectDocument);

export default router;