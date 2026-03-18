import Case from "../models/caseModel.js";
import Meeting from "../models/meetingModel.js";

/* ════════════════════════════════════════
   STATS
════════════════════════════════════════ */
export const getMyCaseStats = async (req, res) => {
  try {
    const managerId = req.user.id;

    const [total, pendingReview, active, resolved, awarded, exParte] = await Promise.all([
      Case.countDocuments({ assignedCaseManager: managerId }),
      Case.countDocuments({ assignedCaseManager: managerId, adminStatus: "pending-review" }),
      Case.countDocuments({
        assignedCaseManager: managerId,
        status: { $in: ["In Review","Assigned","Hearing","hearing","in-progress","notice-sent","mediation","arbitration"] },
      }),
      Case.countDocuments({ assignedCaseManager: managerId, status: { $in: ["Resolved","resolved"] } }),
      Case.countDocuments({ assignedCaseManager: managerId, status: "awarded" }),
      Case.countDocuments({ assignedCaseManager: managerId, isExParte: true }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        total, pendingReview, active, resolved, awarded, exParte,
        resolutionRate: total > 0 ? (((resolved + awarded) / total) * 100).toFixed(1) : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   MY CASES
════════════════════════════════════════ */
export const getMyCases = async (req, res) => {
  try {
    const { status, caseType, priority, adminStatus, page = 1, limit = 20, search } = req.query;

    const filter = { assignedCaseManager: req.user.id };
    if (status)      filter.status      = status;
    if (caseType)    filter.caseType    = caseType;
    if (priority)    filter.priority    = priority;
    if (adminStatus) filter.adminStatus = adminStatus;
    if (search) {
      filter.$or = [
        { caseTitle: { $regex: search, $options: "i" } },
        { caseId:    { $regex: search, $options: "i" } },
      ];
    }

    const total = await Case.countDocuments(filter);
    const cases = await Case.find(filter)
      .populate("claimant",          "name email phone avatar")
      .populate("createdBy",         "name email phone")
      .populate("respondent.userId", "name email phone")
      .populate("assignedNeutral",   "name email avatar role")
      .populate("assignedMediator",  "name email avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({ success: true, total, cases });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   GET SINGLE CASE
════════════════════════════════════════ */
export const getMyCaseById = async (req, res) => {
  try {
    const caseData = await Case.findOne({
      _id: req.params.id,
      assignedCaseManager: req.user.id,
    })
      .populate("claimant",            "name email phone avatar")
      .populate("createdBy",           "name email phone")
      .populate("respondent.userId",   "name email phone avatar")
      .populate("assignedNeutral",     "name email avatar role")
      .populate("assignedMediator",    "name email avatar")
      .populate("timeline.performedBy","name role avatar");

    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    return res.status(200).json({ success: true, case: caseData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   UPDATE CASE STATUS
   Case managers can move cases through workflow statuses
════════════════════════════════════════ */
export const updateMyCaseStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    // Case managers can move to these statuses only
    const allowed = [
      "In Review", "in-progress", "notice-sent",
      "Assigned", "Hearing", "hearing",
      "mediation", "arbitration",
      "Resolved", "resolved",
    ];

    if (!allowed.includes(status))
      return res.status(403).json({ message: `Case managers cannot set status to: ${status}` });

    const caseData = await Case.findOne({ _id: req.params.id, assignedCaseManager: req.user.id });
    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    const prev = caseData.status;
    caseData.status = status;
    if (["Resolved","resolved"].includes(status)) caseData.resolvedAt = new Date();

    caseData.timeline.push({
      action:      `Status Changed: ${prev} → ${status}`,
      performedBy: req.user.id,
      note:        note || "",
      isSystem:    false,
    });

    await caseData.save();
    return res.status(200).json({ success: true, message: "Status updated", case: caseData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   SCHEDULE HEARING
════════════════════════════════════════ */
export const scheduleMyCaseHearing = async (req, res) => {
  try {
    const { hearingDate, hearingLink, hearingNotes } = req.body;
    if (!hearingDate)
      return res.status(400).json({ message: "Hearing date is required" });

    const caseData = await Case.findOne({ _id: req.params.id, assignedCaseManager: req.user.id });
    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    caseData.hearingDate  = new Date(hearingDate);
    caseData.hearingLink  = hearingLink  || "";
    caseData.hearingNotes = hearingNotes || "";
    caseData.status       = "Hearing";

    caseData.timeline.push({
      action:      "Hearing Scheduled",
      performedBy: req.user.id,
      note:        `Scheduled for ${new Date(hearingDate).toUTCString()}`,
      isSystem:    false,
    });

    await caseData.save();
    return res.status(200).json({ success: true, message: "Hearing scheduled", case: caseData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   ADD NOTE
════════════════════════════════════════ */
export const addMyCaseNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ message: "Note is required" });

    const caseData = await Case.findOne({ _id: req.params.id, assignedCaseManager: req.user.id });
    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    caseData.timeline.push({
      action:      "Note Added",
      performedBy: req.user.id,
      note,
      isSystem:    false,
    });

    await caseData.save();
    return res.status(200).json({ success: true, timeline: caseData.timeline });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   MY MEETINGS
════════════════════════════════════════ */
export const getMyMeetings = async (req, res) => {
  try {
    const { page = 1, limit = 10, all } = req.query;

    const filter = {
      $or: [
        { organizer: req.user.id },
        { "participants.user": req.user.id },
      ],
    };

    if (!all) {
      filter.scheduledDate = { $gte: new Date() };
      filter.status = { $in: ["Scheduled", "Confirmed"] };
    }

    const meetings = await Meeting.find(filter)
      .populate("caseId",           "caseId caseTitle status")
      .populate("participants.user","name email avatar")
      .populate("mediator",         "name email avatar")
      .populate("organizer",        "name email")
      .sort({ scheduledDate: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({ success: true, meetings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};