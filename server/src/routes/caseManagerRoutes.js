import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getMyCaseStats, getMyCases, getMyCaseById,
  updateMyCaseStatus, scheduleMyCaseHearing,
  addMyCaseNote, getMyMeetings,
} from "../controllers/caseManagerController.js";

const router = express.Router();
const isCaseManagerOrAdmin = [protect, authorizeRoles(["case-manager", "admin"])];

router.get("/stats",                          ...isCaseManagerOrAdmin, getMyCaseStats);
router.get("/cases",                          ...isCaseManagerOrAdmin, getMyCases);
router.get("/meetings",                       ...isCaseManagerOrAdmin, getMyMeetings);
router.get("/cases/:id",                      ...isCaseManagerOrAdmin, getMyCaseById);
router.patch("/cases/:id/status",             ...isCaseManagerOrAdmin, updateMyCaseStatus);
router.patch("/cases/:id/hearing",            ...isCaseManagerOrAdmin, scheduleMyCaseHearing);
router.post("/cases/:id/note",                ...isCaseManagerOrAdmin, addMyCaseNote);

export default router;