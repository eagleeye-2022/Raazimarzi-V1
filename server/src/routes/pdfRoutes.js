import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import {
  downloadAwardPDF,
  previewAwardPDF,
  verifyAward,
} from "../controllers/pdfController.js";

const router = express.Router();

const adminOrNeutral = [protect, authorizeRoles(["admin","arbitrator","mediator"])];

/* ── Generate + download PDF ── */
router.get("/award/:caseId",         ...adminOrNeutral, downloadAwardPDF);  // GET /api/pdf/award/:caseId
router.get("/award/:caseId/preview", ...adminOrNeutral, previewAwardPDF);   // GET /api/pdf/award/:caseId/preview

/* ── Public verify (QR code scan) — no auth needed ── */
router.get("/verify/:awardRef", verifyAward);                               // GET /api/pdf/verify/:awardRef

export default router;