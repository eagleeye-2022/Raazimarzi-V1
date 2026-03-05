import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import { getMyStats, getMyCases, getMyCaseById, issueAward, issueCourtreferral, addNote, getMyMeetings } from "../controllers/arbitratorController.js";

const router = express.Router();
const isArbitratorOrAdmin = [protect, authorizeRoles(["arbitrator", "admin"])];

router.get("/stats",                      ...isArbitratorOrAdmin, getMyStats);
router.get("/cases",                      ...isArbitratorOrAdmin, getMyCases);
router.get("/meetings",                   ...isArbitratorOrAdmin, getMyMeetings);
router.get("/cases/:id",                  ...isArbitratorOrAdmin, getMyCaseById);
router.patch("/cases/:id/award",          ...isArbitratorOrAdmin, issueAward);
router.patch("/cases/:id/court-referral", ...isArbitratorOrAdmin, issueCourtreferral);
router.post("/cases/:id/note",            ...isArbitratorOrAdmin, addNote);

export default router;