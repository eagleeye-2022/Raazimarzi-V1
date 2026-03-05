import Case from "../models/caseModel.js";
import Meeting from "../models/meetingModel.js";

/* ─── MY STATS ─── */
export const getMyStats = async (req, res) => {
  try {
    const mediatorId = req.user.id;

    const [total, active, resolved, hearings] = await Promise.all([
      Case.countDocuments({ assignedMediator: mediatorId }),
      Case.countDocuments({
        assignedMediator: mediatorId,
        status: { $in: ["Assigned", "Hearing"] },
      }),
      Case.countDocuments({ assignedMediator: mediatorId, status: "Resolved" }),
      Meeting.countDocuments({
        mediator: mediatorId,
        status: { $in: ["Scheduled", "Confirmed"] },
        scheduledDate: { $gte: new Date() },
      }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        total,
        active,
        resolved,
        upcomingHearings: hearings,
        resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ─── MY CASES ─── */
export const getMyCases = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { assignedMediator: req.user.id };
    if (status) filter.status = status;

    const total = await Case.countDocuments(filter);
    const cases = await Case.find(filter)
      .populate("assignedCaseManager", "name email avatar")
      .populate("createdBy", "name email phone")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({ success: true, total, cases });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ─── GET SINGLE CASE (only if assigned to me) ─── */
export const getMyCaseById = async (req, res) => {
  try {
    const caseData = await Case.findOne({
      _id: req.params.id,
      assignedMediator: req.user.id,
    })
      .populate("assignedCaseManager", "name email avatar")
      .populate("createdBy", "name email phone")
      .populate("timeline.performedBy", "name role");

    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    return res.status(200).json({ success: true, case: caseData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ─── SUBMIT RESOLUTION ─── */
export const resolveCase = async (req, res) => {
  try {
    const { resolutionSummary, awardDocumentUrl } = req.body;

    if (!resolutionSummary)
      return res.status(400).json({ message: "Resolution summary is required" });

    const caseData = await Case.findOne({
      _id: req.params.id,
      assignedMediator: req.user.id,
    });

    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    if (!["Assigned", "Hearing"].includes(caseData.status))
      return res.status(400).json({ message: "Case must be in Assigned or Hearing status to resolve" });

    caseData.status = "Resolved";
    caseData.resolutionSummary = resolutionSummary;
    caseData.awardDocumentUrl = awardDocumentUrl || "";
    caseData.resolvedAt = new Date();

    caseData.timeline.push({
      action: "Case Resolved",
      performedBy: req.user.id,
      note: resolutionSummary,
    });

    await caseData.save();
    return res.status(200).json({ success: true, message: "Case resolved", case: caseData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ─── ADD NOTE ─── */
export const addNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ message: "Note is required" });

    const caseData = await Case.findOne({
      _id: req.params.id,
      assignedMediator: req.user.id,
    });

    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    caseData.timeline.push({
      action: "Note Added",
      performedBy: req.user.id,
      note,
    });

    await caseData.save();
    return res.status(200).json({ success: true, timeline: caseData.timeline });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ─── MY UPCOMING MEETINGS ─── */
export const getMyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      mediator: req.user.id,
      scheduledDate: { $gte: new Date() },
      status: { $in: ["Scheduled", "Confirmed"] },
    })
      .populate("caseId", "caseId caseTitle")
      .populate("participants.user", "name email")
      .sort({ scheduledDate: 1 });

    return res.status(200).json({ success: true, meetings });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};