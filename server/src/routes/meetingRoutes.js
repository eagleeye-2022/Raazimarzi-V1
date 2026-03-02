import express from "express";
import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
import {
  createMeeting,
  getMeetingsByCase,
  getMeetingById,
  updateMeeting,
  rescheduleMeeting,
  cancelMeeting,
  completeMeeting,
  getMediatorAvailability,
  getAllMeetings,
  getMyMeetings,
} from "../controllers/meetingController.js";

const router = express.Router();

/* ═══════════════════════════════════════════════════════════════
   USER ROUTES
═══════════════════════════════════════════════════════════════ */

// Get my meetings (upcoming + past)
router.get("/my-meetings", protect, getMyMeetings);

// Create a new meeting
router.post("/", protect, createMeeting);

// Get all meetings for a case
router.get("/case/:caseId", protect, getMeetingsByCase);

// Get single meeting details
router.get("/:id", protect, getMeetingById);

// Update meeting (organizer/mediator/admin only)
router.put("/:id", protect, updateMeeting);

// Reschedule meeting
router.patch("/:id/reschedule", protect, rescheduleMeeting);

// Cancel meeting
router.patch("/:id/cancel", protect, cancelMeeting);

// Mark meeting as completed
router.patch("/:id/complete", protect, completeMeeting);

// Check mediator availability
router.get("/availability/check", protect, getMediatorAvailability);

/* ═══════════════════════════════════════════════════════════════
   ADMIN ROUTES
═══════════════════════════════════════════════════════════════ */

// Get all meetings across all cases (admin only)
router.get(
  "/",
  protect,
  authorizeRoles(["admin"]),
  getAllMeetings
);

export default router;