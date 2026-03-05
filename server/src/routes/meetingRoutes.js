import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import {
  createMeeting,
  getMyMeetings,
  getAllMeetings,
  getMeetingsByCase,
  getMeetingById,
  updateMeeting,
  rescheduleMeeting,
  cancelMeeting,
  completeMeeting,
  getMediatorAvailability,
} from "../controllers/meetingController.js";

const router = express.Router();

const adminOnly = [protect, authorizeRoles(["admin"])];
const adminOrManager = [protect, authorizeRoles(["admin", "case-manager"])];
const adminManagerOrMediator = [protect, authorizeRoles(["admin", "case-manager", "mediator"])];

/* ─ Specific string routes FIRST ─ */
router.get("/my", protect, getMyMeetings);
router.get("/all", ...adminOnly, getAllMeetings);
router.get("/availability", ...adminOrManager, getMediatorAvailability);
router.get("/case/:caseId", protect, getMeetingsByCase);
router.post("/", ...adminOrManager, createMeeting);

/* ─ Param routes LAST ─ */
router.get("/:id", protect, getMeetingById);
router.put("/:id", ...adminOrManager, updateMeeting);
router.patch("/:id/reschedule", ...adminOrManager, rescheduleMeeting);
router.patch("/:id/cancel", ...adminOrManager, cancelMeeting);
router.patch("/:id/complete", ...adminManagerOrMediator, completeMeeting);

export default router;