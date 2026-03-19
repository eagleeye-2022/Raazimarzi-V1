import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import {
  submitFeedback,
  getCaseFeedback,
  getMyFeedback,
  getAllFeedback,
  flagFeedback,
  moderateFeedback,
  deleteFeedback,
  canSubmitFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

const adminOnly = [protect, authorizeRoles(["admin"])];

/* ─── User routes ─── */
router.post("/",                        protect,      submitFeedback);      // POST /api/feedback
router.get("/my",                       protect,      getMyFeedback);       // GET  /api/feedback/my
router.get("/can-submit/:caseId",       protect,      canSubmitFeedback);   // GET  /api/feedback/can-submit/:caseId
router.get("/case/:caseId",             protect,      getCaseFeedback);     // GET  /api/feedback/case/:caseId

/* ─── Admin routes ─── */
router.get("/all",                      ...adminOnly, getAllFeedback);       // GET  /api/feedback/all
router.patch("/:id/flag",               ...adminOnly, flagFeedback);        // PATCH /api/feedback/:id/flag
router.patch("/:id/moderate",           ...adminOnly, moderateFeedback);    // PATCH /api/feedback/:id/moderate
router.delete("/:id",                   ...adminOnly, deleteFeedback);      // DELETE /api/feedback/:id

export default router;