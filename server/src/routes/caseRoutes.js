import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  fileNewCase,
  getMe,
  getUserCases,
  getAllCases,
  getCaseById,
  updateCaseStatus,
} from "../controllers/caseController.js";

const router = express.Router();

// ==================== USER ROUTES ====================
router.post("/file", protect, fileNewCase);

// ⚠️ Specific string routes MUST come before wildcard /:id
router.get("/me", protect, getMe);            
router.get("/my-cases", protect, getUserCases); 
router.get("/all", protect, getAllCases);       

router.get("/:id", protect, getCaseById);       

// ==================== ADMIN ROUTES ====================
router.patch("/:id/status", protect, updateCaseStatus);

export default router;