import Meeting from "../models/meetingModel.js";
import Case from "../models/caseModel.js";
import User from "../models/userModel.js";

/* ═══════════════════════════════════════════════════════════════
   HELPER: Check if user has access to case
═══════════════════════════════════════════════════════════════ */
const canAccessCase = async (userId, caseId, userRole) => {
  if (userRole === "admin") return true;

  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) return false;

  // User created the case
  if (caseDoc.createdBy.toString() === userId.toString()) return true;

  // User is defendant
  const user = await User.findById(userId);
  if (caseDoc.defendantDetails?.email === user?.email) return true;

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
      meetingTitle,
      description,
      caseId,
      meetingType,
      scheduledDate,
      startTime,
      endTime,
      timezone,
      mediatorId,
      participants,
      locationType,
      virtualMeeting,
      physicalLocation,
      agendaItems,
      isPrivate,
    } = req.body;

    // ✅ Validation
    if (!meetingTitle || !caseId || !meetingType || !scheduledDate || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ✅ Verify case exists and user has access
    const caseExists = await Case.findById(caseId);
    if (!caseExists) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    const hasAccess = await canAccessCase(req.user._id, caseId, req.user.role);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this case",
      });
    }

    // ✅ Calculate duration
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const duration = endMinutes - startMinutes;

    if (duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "End time must be after start time",
      });
    }

    // ✅ Create meeting object
    const meetingData = {
      meetingTitle,
      description,
      caseId,
      meetingType,
      scheduledDate: new Date(scheduledDate),
      startTime,
      endTime,
      duration,
      timezone: timezone || "Asia/Kolkata",
      organizer: req.user._id,
      mediator: mediatorId,
      participants: participants || [],
      locationType: locationType || "virtual",
      virtualMeeting,
      physicalLocation,
      agendaItems,
      isPrivate: isPrivate || false,
    };

    const meeting = new Meeting(meetingData);

    // ✅ Check for time conflicts if mediator is assigned
    if (mediatorId) {
      const hasConflict = await meeting.hasConflict(mediatorId);
      if (hasConflict) {
        return res.status(409).json({
          success: false,
          message: "Time slot conflicts with another meeting",
        });
      }
    }

    await meeting.save();

    const populatedMeeting = await Meeting.findById(meeting._id)
      .populate("organizer", "name email")
      .populate("mediator", "name email")
      .populate("caseId", "caseId caseTitle")
      .populate("participants.user", "name email");

    res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
      meeting: populatedMeeting,
    });
  } catch (error) {
    console.error("❌ Create meeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create meeting",
      error: error.message,
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   2. GET MEETINGS BY CASE
═══════════════════════════════════════════════════════════════ */
export const getMeetingsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    // ✅ Verify access
    const hasAccess = await canAccessCase(req.user._id, caseId, req.user.role);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const meetings = await Meeting.find({ caseId })
      .populate("organizer", "name email")
      .populate("mediator", "name email")
      .populate("participants.user", "name email")
      .sort({ scheduledDate: -1, startTime: -1 });

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    console.error("❌ Get meetings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   3. GET SINGLE MEETING
═══════════════════════════════════════════════════════════════ */
export const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("mediator", "name email")
      .populate("caseId", "caseId caseTitle")
      .populate("participants.user", "name email")
      .populate("attachedDocuments");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // ✅ Check access
    const hasAccess = await canAccessCase(req.user._id, meeting.caseId._id, req.user.role);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    console.error("❌ Get meeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meeting",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   4. UPDATE MEETING
═══════════════════════════════════════════════════════════════ */
export const updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // ✅ Only organizer, mediator, or admin can update
    const isAuthorized =
      req.user.role === "admin" ||
      meeting.organizer.toString() === req.user._id.toString() ||
      meeting.mediator?.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ✅ Update allowed fields
    const allowedUpdates = [
      "meetingTitle",
      "description",
      "meetingType",
      "virtualMeeting",
      "physicalLocation",
      "agendaItems",
      "meetingNotes",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        meeting[field] = req.body[field];
      }
    });

    await meeting.save();

    const updated = await Meeting.findById(meeting._id)
      .populate("organizer", "name email")
      .populate("mediator", "name email")
      .populate("caseId", "caseId caseTitle");

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      meeting: updated,
    });
  } catch (error) {
    console.error("❌ Update meeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update meeting",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   5. RESCHEDULE MEETING
═══════════════════════════════════════════════════════════════ */
export const rescheduleMeeting = async (req, res) => {
  try {
    const { newDate, newStartTime, newEndTime, reason } = req.body;

    if (!newDate || !newStartTime || !newEndTime) {
      return res.status(400).json({
        success: false,
        message: "New date and time are required",
      });
    }

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // ✅ Only organizer, mediator, or admin can reschedule
    const isAuthorized =
      req.user.role === "admin" ||
      meeting.organizer.toString() === req.user._id.toString() ||
      meeting.mediator?.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ✅ Check new time slot for conflicts
    const tempMeeting = new Meeting({
      ...meeting.toObject(),
      scheduledDate: new Date(newDate),
      startTime: newStartTime,
      endTime: newEndTime,
    });

    if (meeting.mediator) {
      const hasConflict = await tempMeeting.hasConflict(meeting.mediator);
      if (hasConflict) {
        return res.status(409).json({
          success: false,
          message: "New time slot conflicts with another meeting",
        });
      }
    }

    await meeting.reschedule(
      new Date(newDate),
      newStartTime,
      newEndTime,
      reason,
      req.user._id
    );

    const updated = await Meeting.findById(meeting._id)
      .populate("organizer", "name email")
      .populate("mediator", "name email")
      .populate("caseId", "caseId caseTitle");

    res.status(200).json({
      success: true,
      message: "Meeting rescheduled successfully",
      meeting: updated,
    });
  } catch (error) {
    console.error("❌ Reschedule meeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reschedule meeting",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   6. CANCEL MEETING
═══════════════════════════════════════════════════════════════ */
export const cancelMeeting = async (req, res) => {
  try {
    const { reason } = req.body;

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // ✅ Only organizer, mediator, or admin can cancel
    const isAuthorized =
      req.user.role === "admin" ||
      meeting.organizer.toString() === req.user._id.toString() ||
      meeting.mediator?.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await meeting.cancel(reason, req.user._id);

    res.status(200).json({
      success: true,
      message: "Meeting cancelled successfully",
      meeting,
    });
  } catch (error) {
    console.error("❌ Cancel meeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel meeting",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   7. COMPLETE MEETING
═══════════════════════════════════════════════════════════════ */
export const completeMeeting = async (req, res) => {
  try {
    const { summary, agreementReached, nextSteps, meetingNotes } = req.body;

    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // ✅ Only organizer, mediator, or admin can mark as complete
    const isAuthorized =
      req.user.role === "admin" ||
      meeting.organizer.toString() === req.user._id.toString() ||
      meeting.mediator?.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    meeting.status = "Completed";
    meeting.outcome = {
      summary,
      agreementReached: agreementReached || false,
      nextSteps,
      recordedBy: req.user._id,
      recordedAt: new Date(),
    };

    if (meetingNotes) {
      meeting.meetingNotes = meetingNotes;
    }

    await meeting.save();

    const updated = await Meeting.findById(meeting._id)
      .populate("organizer", "name email")
      .populate("mediator", "name email")
      .populate("outcome.recordedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Meeting marked as completed",
      meeting: updated,
    });
  } catch (error) {
    console.error("❌ Complete meeting error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to complete meeting",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   8. GET MEDIATOR AVAILABILITY
═══════════════════════════════════════════════════════════════ */
export const getMediatorAvailability = async (req, res) => {
  try {
    const { mediatorId, date } = req.query;

    if (!mediatorId || !date) {
      return res.status(400).json({
        success: false,
        message: "Mediator ID and date are required",
      });
    }

    // ✅ Get all meetings for this mediator on this date
    const meetings = await Meeting.find({
      mediator: mediatorId,
      scheduledDate: new Date(date),
      status: { $in: ["Scheduled", "Confirmed", "In Progress"] },
    }).select("startTime endTime");

    // ✅ Generate available slots (9 AM to 6 PM, 1-hour slots)
    const workingHours = {
      start: "09:00",
      end: "18:00",
    };

    const bookedSlots = meetings.map((m) => ({
      start: m.startTime,
      end: m.endTime,
    }));

    res.status(200).json({
      success: true,
      mediatorId,
      date,
      workingHours,
      bookedSlots,
    });
  } catch (error) {
    console.error("❌ Get availability error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   9. GET ALL MEETINGS (ADMIN)
═══════════════════════════════════════════════════════════════ */
export const getAllMeetings = async (req, res) => {
  try {
    const { status, meetingType, mediatorId, fromDate, toDate } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (meetingType) filter.meetingType = meetingType;
    if (mediatorId) filter.mediator = mediatorId;
    
    if (fromDate || toDate) {
      filter.scheduledDate = {};
      if (fromDate) filter.scheduledDate.$gte = new Date(fromDate);
      if (toDate) filter.scheduledDate.$lte = new Date(toDate);
    }

    const meetings = await Meeting.find(filter)
      .populate("organizer", "name email")
      .populate("mediator", "name email")
      .populate("caseId", "caseId caseTitle")
      .sort({ scheduledDate: -1, startTime: -1 });

    res.status(200).json({
      success: true,
      count: meetings.length,
      meetings,
    });
  } catch (error) {
    console.error("❌ Get all meetings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch meetings",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   10. GET MY MEETINGS (USER)
═══════════════════════════════════════════════════════════════ */
export const getMyMeetings = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Find meetings where user is organizer, mediator, or participant
    const meetings = await Meeting.find({
      $or: [
        { organizer: userId },
        { mediator: userId },
        { "participants.user": userId },
      ],
    })
      .populate("organizer", "name email")
      .populate("mediator", "name email")
      .populate("caseId", "caseId caseTitle")
      .sort({ scheduledDate: 1, startTime: 1 });

    const now = new Date();
    const upcoming = meetings.filter((m) => new Date(m.scheduledDate) >= now);
    const past = meetings.filter((m) => new Date(m.scheduledDate) < now);

    res.status(200).json({
      success: true,
      upcoming,
      past,
      total: meetings.length,
    });
  } catch (error) {
    console.error("❌ Get my meetings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your meetings",
    });
  }
};