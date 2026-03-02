import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/documentUpload.js";
import {
  uploadDocument,
  getDocumentsByCase,
  getDocumentById,
  downloadDocument,
  updateDocument,
  deleteDocument,
  approveDocument,
  rejectDocument,
  getAllDocuments,
} from "../controllers/documentController.js";

const router = express.Router();

/* ═══════════════════════════════════════════════════════════════
   USER ROUTES (Petitioner, Defendant)
═══════════════════════════════════════════════════════════════ */

// Upload a document to a case
router.post(
  "/upload",
  protect,
  upload.single("document"), // field name in form-data
  uploadDocument
);

// Get all documents for a specific case (user must have access to case)
router.get("/case/:caseId", protect, getDocumentsByCase);

// Get single document details
router.get("/:id", protect, getDocumentById);

// Download a document
router.get("/:id/download", protect, downloadDocument);

// Update document metadata (uploader or admin only)
router.put("/:id", protect, updateDocument);

// Delete document (uploader or admin only)
router.delete("/:id", protect, deleteDocument);

/* ═══════════════════════════════════════════════════════════════
   ADMIN ROUTES
═══════════════════════════════════════════════════════════════ */

// Get all documents across all cases (admin only)
router.get(
  "/",
  protect,
  authorizeRoles(["admin"]),
  getAllDocuments
);

// Approve a document (admin only)
router.patch(
  "/:id/approve",
  protect,
  authorizeRoles(["admin"]),
  approveDocument
);

// Reject a document (admin only)
router.patch(
  "/:id/reject",
  protect,
  authorizeRoles(["admin"]),
  rejectDocument
);

export default router;