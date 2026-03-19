import Meeting from "../models/meetingModel.js";
import Case    from "../models/caseModel.js";
import User    from "../models/userModel.js";
import {
  sendMeetingScheduledEmails,
  sendMeetingRescheduledEmails,
  sendMeetingCancelledEmails,
} from "../services/mail.service.js";

/* ═══════════════════════════════════════════════════════════════
   HELPER: Check if user has access to a case
═══════════════════════════════════════════════════════════════ */
const canAccessCase = async (userId, caseId, userRole) => {
  if (userRole === "admin" || userRole === "case-manager") return true;
  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) return false;
  if (caseDoc.claimant?.toString()           === userId.toString()) return true;
  if (caseDoc.createdBy?.toString()          === userId.toString()) return true;
  if (caseDoc.respondent?.userId?.toString() === userId.toString()) return true;
  if (caseDoc.assignedNeutral?.toString()    === userId.toString()) return true;
  if (caseDoc.assignedMediator?.toString()   === userId.toString()) return true;
  const user = await User.findById(userId).select("email");
  if (caseDoc.defendantDetails?.email        === user?.email) return true;
  if (caseDoc.respondent?.email              === user?.email?.toLowerCase()) return true;
  return false;
};

/* ═══════════════════════════════════════════════════════════════
   HELPER: Parse time string to minutes since midnight
═══════════════════════════════════════════════════════════════ */
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

/* ═══════════════════════════════════════════════════════════════
   1. CREATE MEETING
═══════════════════════════════════════════════════════════════ */
export const createMeeting = async (req, res) => {
  try {
    const {
      meetingTitle, description, caseId, meetingType,
      scheduledDate, startTime, endTime, timezone,
      mediatorId, participants,
      locationType, virtualMeeting, physicalLocation,
      agendaItems, isPrivate, requiresApproval,
    } = req.body;

    if (!meetingTitle || !caseId || !meetingType || !scheduledDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: meetingTitle, caseId, meetingType, scheduledDate, startTime, endTime",
      });
    }

    const caseExists = await Case.findById(caseId)
      .populate("claimant",          "name email")
      .populate("createdBy",         "name email")
      .populate("respondent.userId", "name email");

    if (!caseExists)
      return res.status(404).json({ success: false, message: "Case not found" });

    const hasAccess = await canAccessCase(req.user._id, caseId, req.user.role);
    if (!hasAccess)
      return res.status(403).json({ success: false, message: "Access denied to this case" });

    const startMinutes = timeToMinutes(startTime);
    const endMinutes   = timeToMinutes(endTime);
    const duration     = endMinutes - startMinutes;

    if (duration <= 0)
      return res.status(400).json({ success: false, message: "End time must be after start time" });

    const meeting = new Meeting({
      meetingTitle, description, caseId, meetingType,
      scheduledDate:    new Date(scheduledDate),
      startTime, endTime, duration,
      timezone:         timezone     || "Asia/Kolkata",
      organizer:        req.user._id,
      mediator:         mediatorId   || null,
      participants:     participants || [],
      locationType:     locationType || "virtual",
      virtualMeeting, physicalLocation, agendaItems,
      isPrivate:        isPrivate        || false,
      requiresApproval: requiresApproval || false,
    });

    if (mediatorId) {
      const hasConflict = await meeting.hasConflict(mediatorId);
      if (hasConflict)
        return res.status(409).json({ success: false, message: "Time slot conflicts with another meeting for this mediator" });
    }

    await meeting.save();

    if (!["Hearing", "hearing"].includes(caseExists.status)) {
      caseExists.status      = "Hearing";
      caseExists.hearingDate = new Date(scheduledDate);
      caseExists.hearingLink = virtualMeeting?.meetingLink || "";
      caseExists.timeline.push({
        action:      "Hearing Scheduled",
        performedBy: req.user._id,
        note:        `${meetingType} scheduled for ${new Date(scheduledDate).toUTCString()}`,
        isSystem:    false,
      });
      await caseExists.save();
    }

    const populated = await Meeting.findById(meeting._id)
      .populate("organizer",         "name email")
      .populate("mediator",          "name email avatar")
      .populate("caseId",            "caseId caseTitle")
      .populate("participants.user", "name email");

    try {
      await sendMeetingScheduledEmails({ meeting: populated, caseData: caseExists });
    } catch (mailErr) {
      console.warn("⚠️ Meeting email notifications failed:", mailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully. All parties have been notified.",
      meeting: populated,
    });
  } catch (error) {
    console.error("❌ createMeeting error:", error);
    return res.status(500).json({ success: false, message: "Failed to create meeting", error: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   2. GET MEETINGS BY CASE
═══════════════════════════════════════════════════════════════ */
export const getMeetingsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    const hasAccess = await canAccessCase(req.user._id, caseId, req.user.role);
    if (!hasAccess)
      return res.status(403).json({ success: false, message: "Access denied" });

    const meetings = await Meeting.find({ caseId })
      .populate("organizer",         "name email")
      .populate("mediator",          "name email avatar")
      .populate("participants.user", "name email")
      .sort({ scheduledDate: -1, startTime: -1 });

    return res.status(200).json({ success: true, count: meetings.length, meetings });
  } catch (error) {
    console.error("❌ getMeetingsByCase error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch meetings" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   3. GET SINGLE MEETING
═══════════════════════════════════════════════════════════════ */
export const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("organizer",         "name email avatar")
      .populate("mediator",          "name email avatar")
      .populate("caseId",            "caseId caseTitle")
      .populate("participants.user", "name email avatar")
      .populate("attachedDocuments")
      .populate("approvedBy",        "name email");

    if (!meeting)
      return res.status(404).json({ success: false, message: "Meeting not found" });

    const hasAccess = await canAccessCase(req.user._id, meeting.caseId._id, req.user.role);
    if (!hasAccess)
      return res.status(403).json({ success: false, message: "Access denied" });

    return res.status(200).json({ success: true, meeting });
  } catch (error) {
    console.error("❌ getMeetingById error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch meeting" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   4. UPDATE MEETING
═══════════════════════════════════════════════════════════════ */
export const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting)
      return res.status(404).json({ success: false, message: "Meeting not found" });

    if (["Completed", "Cancelled"].includes(meeting.status))
      return res.status(400).json({ success: false, message: `Cannot update a ${meeting.status} meeting` });

    const isAuthorized =
      req.user.role === "admin" || req.user.role === "case-manager" ||
      meeting.organizer.toString() === req.user._id.toString() ||
      meeting.mediator?.toString() === req.user._id.toString();

    if (!isAuthorized)
      return res.status(403).json({ success: false, message: "Access denied" });

    const allowedUpdates = [
      "meetingTitle", "description", "meetingType",
      "virtualMeeting", "physicalLocation",
      "agendaItems", "meetingNotes",
    ];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) meeting[field] = req.body[field];
    });

    await meeting.save();

    const updated = await Meeting.findById(meeting._id)
      .populate("organizer", "name email")
      .populate("mediator",  "name email avatar")
      .populate("caseId",    "caseId caseTitle");

    return res.status(200).json({ success: true, message: "Meeting updated successfully", meeting: updated });
  } catch (error) {
    console.error("❌ updateMeeting error:", error);
    return res.status(500).json({ success: false, message: "Failed to update meeting" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   5. RESCHEDULE MEETING
═══════════════════════════════════════════════════════════════ */
export const rescheduleMeeting = async (req, res) => {
  try {
    const { newDate, newStartTime, newEndTime, reason } = req.body;

    if (!newDate || !newStartTime || !newEndTime)
      return res.status(400).json({ success: false, message: "newDate, newStartTime and newEndTime are required" });

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting)
      return res.status(404).json({ success: false, message: "Meeting not found" });

    if (["Completed", "Cancelled"].includes(meeting.status))
      return res.status(400).json({ success: false, message: `Cannot reschedule a ${meeting.status} meeting` });

    const isAuthorized =
      req.user.role === "admin" || req.user.role === "case-manager" ||
      meeting.organizer.toString() === req.user._id.toString() ||
      meeting.mediator?.toString() === req.user._id.toString();

    if (!isAuthorized)
      return res.status(403).json({ success: false, message: "Access denied" });

    if (meeting.mediator) {
      const tempMeeting = new Meeting({
        ...meeting.toObject(),
        _id:           meeting._id,
        scheduledDate: new Date(newDate),
        startTime:     newStartTime,
        endTime:       newEndTime,
      });
      const hasConflict = await tempMeeting.hasConflict(meeting.mediator);
      if (hasConflict)
        return res.status(409).json({ success: false, message: "New time slot conflicts with another meeting" });
    }

    await meeting.reschedule(new Date(newDate), newStartTime, newEndTime, reason, req.user._id);

    const updated = await Meeting.findById(meeting._id)
      .populate("organizer", "name email")
      .populate("mediator",  "name email avatar")
      .populate("caseId",    "caseId caseTitle");

    try {
      const caseData = await Case.findById(meeting.caseId)
        .populate("claimant",  "name email")
        .populate("createdBy", "name email");
      if (caseData) {
        await sendMeetingRescheduledEmails({ meeting: updated, caseData, rescheduledBy: req.user });
      }
    } catch (mailErr) {
      console.warn("⚠️ Reschedule email failed:", mailErr.message);
    }

    return res.status(200).json({ success: true, message: "Meeting rescheduled. All parties notified.", meeting: updated });
  } catch (error) {
    console.error("❌ rescheduleMeeting error:", error);
    return res.status(500).json({ success: false, message: "Failed to reschedule meeting" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   6. CANCEL MEETING
═══════════════════════════════════════════════════════════════ */
export const cancelMeeting = async (req, res) => {
  try {
    const { reason } = req.body;

    const meeting = await Meeting.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("mediator",  "name email");

    if (!meeting)
      return res.status(404).json({ success: false, message: "Meeting not found" });

    if (["Completed", "Cancelled"].includes(meeting.status))
      return res.status(400).json({ success: false, message: `Meeting is already ${meeting.status}` });

    const isAuthorized =
      req.user.role === "admin" || req.user.role === "case-manager" ||
      meeting.organizer.toString() === req.user._id.toString() ||
      meeting.mediator?.toString() === req.user._id.toString();

    if (!isAuthorized)
      return res.status(403).json({ success: false, message: "Access denied" });

    await meeting.cancel(reason || "Cancelled", req.user._id);

    try {
      const caseData = await Case.findById(meeting.caseId)
        .populate("claimant",  "name email")
        .populate("createdBy", "name email");
      if (caseData) {
        await sendMeetingCancelledEmails({ meeting, caseData, reason });
      }
    } catch (mailErr) {
      console.warn("⚠️ Cancellation email failed:", mailErr.message);
    }

    return res.status(200).json({ success: true, message: "Meeting cancelled. All parties notified.", meeting });
  } catch (error) {
    console.error("❌ cancelMeeting error:", error);
    return res.status(500).json({ success: false, message: "Failed to cancel meeting" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   7. COMPLETE MEETING
═══════════════════════════════════════════════════════════════ */
export const completeMeeting = async (req, res) => {
  try {
    const { summary, agreementReached, nextSteps, meetingNotes } = req.body;

    const meeting = await Meeting.findById(req.params.id);
    if (!meeting)
      return res.status(404).json({ success: false, message: "Meeting not found" });

    if (meeting.status === "Completed")
      return res.status(400).json({ success: false, message: "Meeting already completed" });

    const isAuthorized =
      req.user.role === "admin" || req.user.role === "case-manager" ||
      meeting.organizer.toString() === req.user._id.toString() ||
      meeting.mediator?.toString() === req.user._id.toString();

    if (!isAuthorized)
      return res.status(403).json({ success: false, message: "Access denied" });

    meeting.status  = "Completed";
    meeting.outcome = {
      summary:          summary          || "",
      agreementReached: agreementReached || false,
      nextSteps:        nextSteps        || "",
      recordedBy:       req.user._id,
      recordedAt:       new Date(),
    };
    if (meetingNotes) meeting.meetingNotes = meetingNotes;
    await meeting.save();

    const updated = await Meeting.findById(meeting._id)
      .populate("organizer",          "name email")
      .populate("mediator",           "name email avatar")
      .populate("outcome.recordedBy", "name email");

    return res.status(200).json({ success: true, message: "Meeting marked as completed", meeting: updated });
  } catch (error) {
    console.error("❌ completeMeeting error:", error);
    return res.status(500).json({ success: false, message: "Failed to complete meeting" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   8. GET MEDIATOR AVAILABILITY
═══════════════════════════════════════════════════════════════ */
export const getMediatorAvailability = async (req, res) => {
  try {
    const { mediatorId, date } = req.query;

    if (!mediatorId || !date)
      return res.status(400).json({ success: false, message: "mediatorId and date are required" });

    const mediator = await User.findOne({
      _id:  mediatorId,
      role: { $in: ["mediator", "arbitrator"] },
    }).select("name email avatar role");

    if (!mediator)
      return res.status(404).json({ success: false, message: "Mediator/arbitrator not found" });

    const startOfDay = new Date(date); startOfDay.setHours(0, 0, 0, 0);
    const endOfDay   = new Date(date); endOfDay.setHours(23, 59, 59, 999);

    const meetings = await Meeting.find({
      mediator:      mediatorId,
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
      status:        { $in: ["Scheduled", "Confirmed", "In Progress"] },
    }).select("startTime endTime meetingTitle status");

    const bookedSlots = meetings.map((m) => ({
      startTime: m.startTime, endTime: m.endTime,
      title: m.meetingTitle,  status: m.status,
    }));

    return res.status(200).json({
      success: true, mediator, date,
      workingHours: { start: "09:00", end: "18:00" },
      bookedSlots,
      isAvailable: bookedSlots.length === 0,
    });
  } catch (error) {
    console.error("❌ getMediatorAvailability error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch availability" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   9. GET ALL MEETINGS — ADMIN
═══════════════════════════════════════════════════════════════ */
export const getAllMeetings = async (req, res) => {
  try {
    const { status, meetingType, mediatorId, fromDate, toDate, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status)      filter.status      = status;
    if (meetingType) filter.meetingType = meetingType;
    if (mediatorId)  filter.mediator    = mediatorId;
    if (fromDate || toDate) {
      filter.scheduledDate = {};
      if (fromDate) filter.scheduledDate.$gte = new Date(fromDate);
      if (toDate)   filter.scheduledDate.$lte = new Date(toDate);
    }

    const total    = await Meeting.countDocuments(filter);
    const meetings = await Meeting.find(filter)
      .populate("organizer",         "name email")
      .populate("mediator",          "name email avatar role")
      .populate("caseId",            "caseId caseTitle status")
      .populate("participants.user", "name email")
      .sort({ scheduledDate: -1, startTime: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({ success: true, total, count: meetings.length, meetings });
  } catch (error) {
    console.error("❌ getAllMeetings error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch meetings" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   10. GET MY MEETINGS — logged in user
   ✅ Fixed: renamed conflicting 'upcoming' variable to 'upcomingList'
═══════════════════════════════════════════════════════════════ */
export const getMyMeetings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, upcoming } = req.query;

    const filter = {
      $or: [
        { organizer:           userId },
        { mediator:            userId },
        { "participants.user": userId },
      ],
    };

    if (upcoming === "true") {
      filter.scheduledDate = { $gte: new Date() };
      filter.status        = { $in: ["Scheduled", "Confirmed"] };
    }

    const meetings = await Meeting.find(filter)
      .populate("organizer",         "name email avatar")
      .populate("mediator",          "name email avatar")
      .populate("caseId",            "caseId caseTitle status")
      .populate("participants.user", "name email avatar")
      .sort({ scheduledDate: 1, startTime: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const now          = new Date();
    const upcomingList = meetings.filter((m) => new Date(m.scheduledDate) >= now);
    const pastList     = meetings.filter((m) => new Date(m.scheduledDate) < now);

    return res.status(200).json({
      success:  true,
      total:    meetings.length,
      upcoming: upcomingList,
      past:     pastList,
    });
  } catch (error) {
    console.error("❌ getMyMeetings error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch your meetings" });
  }
};