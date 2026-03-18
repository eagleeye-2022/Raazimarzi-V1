import Case from "../models/caseModel.js";
import Meeting from "../models/meetingModel.js";

/* ── Helper: build mediator case filter (handles both old + new assignment fields) ── */
const mediatorFilter = (mediatorId, extra = {}) => ({
  $or: [
    { assignedNeutral: mediatorId, neutralType: "mediator" },
    { assignedMediator: mediatorId },
  ],
  ...extra,
});

/* ════════════════════════════════════════
   STATS
════════════════════════════════════════ */
export const getMyStats = async (req, res) => {
  try {
    const id = req.user.id;

    const [total, active, resolved, mediation, exParte, hearings] = await Promise.all([
      Case.countDocuments(mediatorFilter(id)),
      Case.countDocuments(mediatorFilter(id, { status: { $in: ["Assigned","Hearing","hearing","in-progress","mediation"] } })),
      Case.countDocuments(mediatorFilter(id, { status: { $in: ["Resolved","resolved"] } })),
      Case.countDocuments(mediatorFilter(id, { status: "mediation" })),
      Case.countDocuments(mediatorFilter(id, { isExParte: true })),
      Meeting.countDocuments({ mediator: id, status: { $in: ["Scheduled","Confirmed"] }, scheduledDate: { $gte: new Date() } }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        total, active, resolved, mediation, exParte,
        upcomingHearings: hearings,
        resolutionRate: total > 0 ? ((resolved / total) * 100).toFixed(1) : 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════
   MY CASES
════════════════════════════════════════ */
export const getMyCases = async (req, res) => {
  try {
    const { status, caseType, page = 1, limit = 20, search } = req.query;
    const id = req.user.id;

    const filter = mediatorFilter(id);
    if (status)   filter.status   = status;
    if (caseType) filter.caseType = caseType;
    if (search) {
      filter.$and = [
        { $or: filter.$or },
        { $or: [
          { caseTitle: { $regex: search, $options: "i" } },
          { caseId:    { $regex: search, $options: "i" } },
        ]},
      ];
      delete filter.$or;
    }

    const total = await Case.countDocuments(filter);
    const cases = await Case.find(filter)
      .populate("claimant",            "name email phone avatar")
      .populate("createdBy",           "name email phone")
      .populate("respondent.userId",   "name email phone")
      .populate("assignedCaseManager", "name email avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({ success: true, total, cases });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════
   GET SINGLE CASE
════════════════════════════════════════ */
export const getMyCaseById = async (req, res) => {
  try {
    const caseData = await Case.findOne(mediatorFilter(req.user.id, { _id: req.params.id }))
      .populate("claimant",            "name email phone avatar")
      .populate("createdBy",           "name email phone")
      .populate("respondent.userId",   "name email phone avatar")
      .populate("assignedCaseManager", "name email avatar")
      .populate("timeline.performedBy","name role avatar");

    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    return res.status(200).json({ success: true, case: caseData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════
   RESOLVE CASE
════════════════════════════════════════ */
export const resolveCase = async (req, res) => {
  try {
    const { resolutionSummary, awardDocumentUrl, awardType } = req.body;
    if (!resolutionSummary)
      return res.status(400).json({ message: "Resolution summary is required" });

    const caseData = await Case.findOne(mediatorFilter(req.user.id, { _id: req.params.id }));
    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    const allowed = ["Assigned","Hearing","hearing","in-progress","mediation"];
    if (!allowed.includes(caseData.status))
      return res.status(400).json({ message: `Cannot resolve case with status: ${caseData.status}` });

    caseData.status            = "resolved";
    caseData.resolutionSummary = resolutionSummary;
    caseData.awardDocumentUrl  = awardDocumentUrl || "";
    caseData.awardType         = awardType || "settlement";
    caseData.resolvedAt        = new Date();
    caseData.timeline.push({ action: "Case Resolved by Mediator", performedBy: req.user.id, note: resolutionSummary, isSystem: false });

    await caseData.save();
    return res.status(200).json({ success: true, message: "Case resolved successfully", case: caseData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════
   ADD NOTE
════════════════════════════════════════ */
export const addNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ message: "Note is required" });

    const caseData = await Case.findOne(mediatorFilter(req.user.id, { _id: req.params.id }));
    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    caseData.timeline.push({ action: "Note Added", performedBy: req.user.id, note, isSystem: false });
    await caseData.save();
    return res.status(200).json({ success: true, timeline: caseData.timeline });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════
   MY MEETINGS
════════════════════════════════════════ */
export const getMyMeetings = async (req, res) => {
  try {
    const { page = 1, limit = 10, all } = req.query;
    const filter = { mediator: req.user.id };
    if (!all) {
      filter.scheduledDate = { $gte: new Date() };
      filter.status = { $in: ["Scheduled", "Confirmed"] };
    }

    const meetings = await Meeting.find(filter)
      .populate("caseId",           "caseId caseTitle status")
      .populate("participants.user","name email avatar")
      .populate("organizer",        "name email")
      .sort({ scheduledDate: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({ success: true, meetings });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════
   REQUEST HEARING
════════════════════════════════════════ */
export const requestHearing = async (req, res) => {
  try {
    const { proposedDate, proposedTime, reason } = req.body;
    if (!proposedDate)
      return res.status(400).json({ message: "Proposed date is required" });

    const caseData = await Case.findOne(mediatorFilter(req.user.id, { _id: req.params.id }));
    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    caseData.timeline.push({
      action:      "Hearing Requested by Mediator",
      performedBy: req.user.id,
      note:        `Proposed: ${proposedDate} ${proposedTime || ""}. Reason: ${reason || "N/A"}`,
      isSystem:    false,
    });

    await caseData.save();
    return res.status(200).json({ success: true, message: "Hearing request submitted to admin" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};