import Case from "../models/caseModel.js";
import Meeting from "../models/meetingModel.js";

/* ════════════════════════════════════════
   STATS
════════════════════════════════════════ */
export const getMyStats = async (req, res) => {
  try {
    const arbitratorId = req.user.id;

    const [total, active, awarded, exParte, courtReferrals, hearings] = await Promise.all([
      Case.countDocuments({ assignedNeutral: arbitratorId, neutralType: "arbitrator" }),
      Case.countDocuments({ assignedNeutral: arbitratorId, neutralType: "arbitrator", status: { $in: ["arbitration", "hearing", "Hearing", "in-progress"] } }),
      Case.countDocuments({ assignedNeutral: arbitratorId, neutralType: "arbitrator", status: "awarded" }),
      Case.countDocuments({ assignedNeutral: arbitratorId, neutralType: "arbitrator", isExParte: true }),
      Case.countDocuments({ assignedNeutral: arbitratorId, neutralType: "arbitrator", courtReferralIssued: true }),
      Meeting.countDocuments({ mediator: arbitratorId, status: { $in: ["Scheduled", "Confirmed"] }, scheduledDate: { $gte: new Date() } }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        total, active, awarded, exParte, courtReferrals,
        upcomingHearings: hearings,
        awardRate: total > 0 ? ((awarded / total) * 100).toFixed(1) : 0,
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

    const filter = { assignedNeutral: req.user.id, neutralType: "arbitrator" };
    if (status)   filter.status   = status;
    if (caseType) filter.caseType = caseType;
    if (search) {
      filter.$or = [
        { caseTitle: { $regex: search, $options: "i" } },
        { caseId:    { $regex: search, $options: "i" } },
      ];
    }

    const total = await Case.countDocuments(filter);
    const cases = await Case.find(filter)
      .populate("claimant",            "name email avatar")
      .populate("createdBy",           "name email")
      .populate("respondent.userId",   "name email avatar")
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
   SINGLE CASE
════════════════════════════════════════ */
export const getMyCaseById = async (req, res) => {
  try {
    const caseData = await Case.findOne({
      _id:             req.params.id,
      assignedNeutral: req.user.id,
      neutralType:     "arbitrator",
    })
      .populate("claimant",             "name email avatar phone")
      .populate("createdBy",            "name email phone")
      .populate("respondent.userId",    "name email avatar phone")
      .populate("assignedCaseManager",  "name email avatar")
      .populate("timeline.performedBy", "name role");

    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    return res.status(200).json({ success: true, case: caseData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════
   ISSUE ARBITRATION AWARD
════════════════════════════════════════ */
export const issueAward = async (req, res) => {
  try {
    const { resolutionSummary, awardDocumentUrl, awardType } = req.body;

    if (!resolutionSummary)
      return res.status(400).json({ message: "Award summary is required" });

    const caseData = await Case.findOne({
      _id:             req.params.id,
      assignedNeutral: req.user.id,
      neutralType:     "arbitrator",
    });

    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    if (!["arbitration", "hearing", "Hearing", "in-progress"].includes(caseData.status))
      return res.status(400).json({ message: "Case is not in a valid state for an award" });

    const finalAwardType = caseData.isExParte ? "ex-parte-award" : (awardType || "arbitration-award");

    caseData.status            = "awarded";
    caseData.resolutionSummary = resolutionSummary;
    caseData.awardDocumentUrl  = awardDocumentUrl || "";
    caseData.awardType         = finalAwardType;
    caseData.resolvedAt        = new Date();

    caseData.timeline.push({
      action:      `Arbitration Award Issued${caseData.isExParte ? " (Ex-Parte)" : ""}`,
      performedBy: req.user.id,
      note:        resolutionSummary,
      isSystem:    false,
    });

    await caseData.save();
    return res.status(200).json({ success: true, message: "Award issued", case: caseData });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ════════════════════════════════════════
   ISSUE COURT REFERRAL
════════════════════════════════════════ */
export const issueCourtreferral = async (req, res) => {
  try {
    const { reason } = req.body;

    const caseData = await Case.findOne({
      _id:             req.params.id,
      assignedNeutral: req.user.id,
      neutralType:     "arbitrator",
    });

    if (!caseData)
      return res.status(404).json({ message: "Case not found or not assigned to you" });

    if (caseData.status !== "awarded")
      return res.status(400).json({ message: "Court referral only possible after award is issued" });

    if (caseData.courtReferralIssued)
      return res.status(400).json({ message: "Court referral already issued" });

    caseData.courtReferralIssued = true;
    caseData.courtReferralAt     = new Date();
    caseData.awardType           = "court-referral";

    caseData.timeline.push({
      action:      "Court Referral Issued",
      performedBy: req.user.id,
      note:        reason || "Claimant advised to enforce award through civil court",
      isSystem:    false,
    });

    await caseData.save();
    return res.status(200).json({ success: true, message: "Court referral issued", case: caseData });
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
    if (!note) return res.status(400).json({ message: "Note required" });

    const caseData = await Case.findOne({
      _id:             req.params.id,
      assignedNeutral: req.user.id,
      neutralType:     "arbitrator",
    });

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
      filter.status        = { $in: ["Scheduled", "Confirmed"] };
    }

    const meetings = await Meeting.find(filter)
      .populate("caseId",            "caseId caseTitle status")
      .populate("participants.user", "name email avatar")
      .populate("organizer",         "name email")
      .sort({ scheduledDate: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({ success: true, meetings });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};