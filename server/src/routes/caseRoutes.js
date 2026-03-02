import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
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

// ✅ ADMIN-ONLY: Get all cases
router.get("/all", protect, authorizeRoles(["admin"]), getAllCases);

router.get("/:id", protect, getCaseById);       

// ==================== ADMIN ROUTES ====================
// ✅ ADMIN-ONLY: Update case status
router.patch("/:id/status", protect, authorizeRoles(["admin"]), updateCaseStatus);

export default router;