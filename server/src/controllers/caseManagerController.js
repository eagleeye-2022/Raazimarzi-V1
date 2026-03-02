import Case from "../models/caseModel.js";
import User from "../models/userModel.js";

/* ─────────────────────────────────────────
   GET CASES ASSIGNED TO THIS CASE MANAGER
───────────────────────────────────────── */
export const getMyCases = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20, search } = req.query;

    const filter = { assignedCaseManager: req.user.id };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { caseTitle: { $regex: search, $options: "i" } },
        { caseId: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Case.countDocuments(filter);
    const cases = await Case.find(filter)
      .populate("assignedMediator", "name email avatar")
      .populate("createdBy", "name email phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, cases });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   GET SINGLE CASE (only if assigned to me)
───────────────────────────────────────── */
export const getMyCaseById = async (req, res) => {
  try {
    const caseData = await Case.findOne({
      _id: req.params.id,
      assignedCaseManager: req.user.id,
    })
      .populate("assignedMediator", "name email avatar")
      .populate("createdBy", "name email phone")
      .populate("timeline.performedBy", "name role");

    if (!caseData) {
      return res.status(404).json({ message: "Case not found or not assigned to you" });
    }

    res.json({ success: true, case: caseData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   UPDATE STATUS (case manager scope)
───────────────────────────────────────── */
export const updateMyCaseStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    // Case managers can only move to these statuses
    const allowed = ["In Review", "Assigned", "Hearing", "Resolved"];
    if (!allowed.includes(status)) {
      return res.status(403).json({ message: `Cannot set status to ${status}` });
    }

    const caseData = await Case.findOne({
      _id: req.params.id,
      assignedCaseManager: req.user.id,
    });

    if (!caseData) {
      return res.status(404).json({ message: "Case not found or not assigned to you" });
    }

    const prev = caseData.status;
    caseData.status = status;

    if (status === "Resolved") caseData.resolvedAt = new Date();

    caseData.timeline.push({
      action: `Status Changed: ${prev} → ${status}`,
      performedBy: req.user.id,
      note: note || "",
    });

    await caseData.save();
    res.json({ success: true, message: "Status updated", case: caseData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   SCHEDULE HEARING
───────────────────────────────────────── */
export const scheduleMyCaseHearing = async (req, res) => {
  try {
    const { hearingDate, hearingLink, hearingNotes } = req.body;
    if (!hearingDate) {
      return res.status(400).json({ message: "Hearing date is required" });
    }

    const caseData = await Case.findOne({
      _id: req.params.id,
      assignedCaseManager: req.user.id,
    });

    if (!caseData) {
      return res.status(404).json({ message: "Case not found or not assigned to you" });
    }

    caseData.hearingDate = new Date(hearingDate);
    caseData.hearingLink = hearingLink || "";
    caseData.hearingNotes = hearingNotes || "";
    caseData.status = "Hearing";

    caseData.timeline.push({
      action: "Hearing Scheduled",
      performedBy: req.user.id,
      note: `Scheduled for ${new Date(hearingDate).toLocaleString()}`,
    });

    await caseData.save();
    res.json({ success: true, message: "Hearing scheduled", case: caseData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   ADD NOTE TO TIMELINE
───────────────────────────────────────── */
export const addMyCaseNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ message: "Note is required" });

    const caseData = await Case.findOne({
      _id: req.params.id,
      assignedCaseManager: req.user.id,
    });

    if (!caseData) {
      return res.status(404).json({ message: "Case not found or not assigned to you" });
    }

    caseData.timeline.push({
      action: "Note Added",
      performedBy: req.user.id,
      note,
    });

    await caseData.save();
    res.json({ success: true, timeline: caseData.timeline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   CASE MANAGER DASHBOARD STATS
───────────────────────────────────────── */
export const getMyCaseStats = async (req, res) => {
  try {
    const managerId = req.user.id;

    const [total, pending, active, resolved] = await Promise.all([
      Case.countDocuments({ assignedCaseManager: managerId }),
      Case.countDocuments({ assignedCaseManager: managerId, status: "Pending" }),
      Case.countDocuments({
        assignedCaseManager: managerId,
        status: { $in: ["In Review", "Assigned", "Hearing"] },
      }),
      Case.countDocuments({ assignedCaseManager: managerId, status: "Resolved" }),
    ]);

    res.json({
      success: true,
      stats: {
        total,
        pending,
        active,
        resolved,
        resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};