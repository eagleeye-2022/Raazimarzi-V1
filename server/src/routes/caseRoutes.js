import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import {
  fileNewCase, getMe, getUserCases,
  getAllCases, getCaseById, updateCaseStatus,
  acceptInvite, submitResponse, withdrawCase, getCaseTimeline,
} from "../controllers/caseController.js";

const router = express.Router();

// ── User routes ──
router.post("/file", protect, fileNewCase);
router.get("/me", protect, getMe);
router.get("/my-cases", protect, getUserCases);         // returns { raisedCases, opponentCases }
router.post("/accept-invite/:token", protect, acceptInvite);

// ── Specific before wildcard ──
router.get("/all", protect, authorizeRoles(["admin"]), getAllCases);

// ── Param routes ──
router.get("/:id", protect, getCaseById);
router.get("/:id/timeline", protect, getCaseTimeline);
router.post("/:id/respond", protect, submitResponse);
router.patch("/:id/withdraw", protect, withdrawCase);
router.patch("/:id/status", protect, authorizeRoles(["admin", "case-manager"]), updateCaseStatus);

export default router;