import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";

import {
  getMyCases,
  getMyCaseById,
  updateMyCaseStatus,
  scheduleMyCaseHearing,
  addMyCaseNote,
  getMyCaseStats,
} from "../controllers/caseManagerController.js";

const router = express.Router();

const isManager = [protect, authorizeRoles(["case-manager", "admin"])];

router.get("/stats", ...isManager, getMyCaseStats);
router.get("/cases", ...isManager, getMyCases);
router.get("/cases/:id", ...isManager, getMyCaseById);
router.patch("/cases/:id/status", ...isManager, updateMyCaseStatus);
router.patch("/cases/:id/hearing", ...isManager, scheduleMyCaseHearing);
router.post("/cases/:id/note", ...isManager, addMyCaseNote);

export default router;