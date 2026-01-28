import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  fileNewCase,
  getUserCases,
  getAllCases,
  getCaseById,
  updateCaseStatus,
} from "../controllers/caseController.js";

const router = express.Router();

// ==================== USER ROUTES ====================
router.post("/file", protect, fileNewCase);
router.get("/my-cases", protect, getUserCases);
router.get("/:id", protect, getCaseById);

// ==================== ADMIN ROUTES ====================
router.get("/all", protect, getAllCases);
router.patch("/:id/status", protect, updateCaseStatus);

export default router;