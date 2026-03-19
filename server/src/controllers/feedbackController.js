import Feedback from "../models/feedbackModel.js";
import Case     from "../models/caseModel.js";

/* ═══════════════════════════════════════════════════════════════
   1. SUBMIT FEEDBACK
   Only claimant or respondent of a resolved/awarded case can submit
═══════════════════════════════════════════════════════════════ */
export const submitFeedback = async (req, res) => {
  try {
    const {
      caseId, overallRating, ratings,
      comment, satisfiedWithOutcome,
      wouldRecommend, tags, isPublic,
    } = req.body;

    if (!caseId || !overallRating)
      return res.status(400).json({ success: false, message: "caseId and overallRating are required" });

    if (overallRating < 1 || overallRating > 5)
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });

    /* ── Verify case exists and is resolved ── */
    const caseData = await Case.findById(caseId);
    if (!caseData)
      return res.status(404).json({ success: false, message: "Case not found" });

    const resolvedStatuses = ["Resolved","resolved","awarded","Closed","closed"];
    if (!resolvedStatuses.includes(caseData.status))
      return res.status(400).json({
        success: false,
        message: "Feedback can only be submitted for resolved or awarded cases",
      });

    /* ── Verify submitter is part of the case ── */
    const userId      = req.user.id;
    const isClaimant  = caseData.claimant?.toString()           === userId ||
                        caseData.createdBy?.toString()          === userId;
    const isRespondent= caseData.respondent?.userId?.toString() === userId ||
                        caseData.respondent?.email             === req.user.email;
    const isNeutral   = caseData.assignedNeutral?.toString()    === userId;

    if (!isClaimant && !isRespondent && !isNeutral && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "You are not a party to this case" });

    /* ── Determine submitter role ── */
    let submitterRole = "claimant";
    if (isRespondent) submitterRole = "respondent";
    else if (isNeutral) {
      submitterRole = caseData.neutralType === "arbitrator" ? "arbitrator" : "mediator";
    }

    /* ── Check for duplicate feedback ── */
    const existing = await Feedback.findOne({ caseId, submittedBy: userId });
    if (existing)
      return res.status(400).json({ success: false, message: "You have already submitted feedback for this case" });

    /* ── Create feedback ── */
    const feedback = await Feedback.create({
      caseId,
      submittedBy:          userId,
      submitterRole,
      overallRating,
      ratings:              ratings || {},
      comment:              comment || "",
      satisfiedWithOutcome: satisfiedWithOutcome ?? null,
      wouldRecommend:       wouldRecommend       ?? null,
      tags:                 tags || [],
      isPublic:             isPublic !== false,
    });

    const populated = await Feedback.findById(feedback._id)
      .populate("submittedBy", "name avatar")
      .populate("caseId",      "caseId caseTitle");

    return res.status(201).json({
      success:  true,
      message:  "Feedback submitted successfully. Thank you!",
      feedback: populated,
    });
  } catch (error) {
    console.error("❌ submitFeedback error:", error);
    if (error.code === 11000)
      return res.status(400).json({ success: false, message: "You have already submitted feedback for this case" });
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   2. GET FEEDBACK FOR A CASE
   Public — shows approved, public feedback
═══════════════════════════════════════════════════════════════ */
export const getCaseFeedback = async (req, res) => {
  try {
    const { caseId } = req.params;

    const filter = { caseId, isApproved: true };
    if (req.user?.role !== "admin") filter.isPublic = true;

    const feedbacks = await Feedback.find(filter)
      .populate("submittedBy", "name avatar")
      .sort({ createdAt: -1 });

    /* ── Aggregate stats ── */
    const stats = feedbacks.reduce((acc, f) => {
      acc.count++;
      acc.totalRating += f.overallRating;
      if (f.satisfiedWithOutcome === true)  acc.satisfied++;
      if (f.wouldRecommend === true)         acc.recommend++;
      return acc;
    }, { count: 0, totalRating: 0, satisfied: 0, recommend: 0 });

    return res.status(200).json({
      success:  true,
      count:    feedbacks.length,
      avgRating: stats.count > 0 ? (stats.totalRating / stats.count).toFixed(1) : 0,
      satisfactionRate: stats.count > 0 ? ((stats.satisfied / stats.count) * 100).toFixed(0) : 0,
      recommendRate:    stats.count > 0 ? ((stats.recommend / stats.count) * 100).toFixed(0) : 0,
      feedbacks,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   3. GET MY FEEDBACK
   User can see their own submitted feedback
═══════════════════════════════════════════════════════════════ */
export const getMyFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ submittedBy: req.user.id })
      .populate("caseId", "caseId caseTitle status")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   4. GET ALL FEEDBACK — ADMIN
   With filters + platform-wide stats
═══════════════════════════════════════════════════════════════ */
export const getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 20, rating, isFlagged, isApproved } = req.query;

    const filter = {};
    if (rating)                          filter.overallRating = Number(rating);
    if (isFlagged  !== undefined)        filter.isFlagged     = isFlagged  === "true";
    if (isApproved !== undefined)        filter.isApproved    = isApproved === "true";

    const total     = await Feedback.countDocuments(filter);
    const feedbacks = await Feedback.find(filter)
      .populate("submittedBy", "name email avatar")
      .populate("caseId",      "caseId caseTitle status")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    /* ── Platform-wide stats ── */
    const allFeedback = await Feedback.find({ isApproved: true });
    const platformStats = allFeedback.reduce((acc, f) => {
      acc.count++;
      acc.totalRating    += f.overallRating;
      acc.totalProcess   += f.ratings?.processRating  || 0;
      acc.totalNeutral   += f.ratings?.neutralRating  || 0;
      acc.totalPlatform  += f.ratings?.platformRating || 0;
      acc.totalTime      += f.ratings?.timeRating     || 0;
      if (f.satisfiedWithOutcome === true) acc.satisfied++;
      if (f.wouldRecommend === true)       acc.recommend++;
      return acc;
    }, { count:0, totalRating:0, totalProcess:0, totalNeutral:0, totalPlatform:0, totalTime:0, satisfied:0, recommend:0 });

    const n = platformStats.count || 1;

    return res.status(200).json({
      success: true,
      total, feedbacks,
      platformStats: {
        totalFeedbacks:   platformStats.count,
        avgOverall:       (platformStats.totalRating   / n).toFixed(1),
        avgProcess:       (platformStats.totalProcess  / n).toFixed(1),
        avgNeutral:       (platformStats.totalNeutral  / n).toFixed(1),
        avgPlatform:      (platformStats.totalPlatform / n).toFixed(1),
        avgTime:          (platformStats.totalTime     / n).toFixed(1),
        satisfactionRate: ((platformStats.satisfied / n) * 100).toFixed(0),
        recommendRate:    ((platformStats.recommend / n) * 100).toFixed(0),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   5. FLAG FEEDBACK — ADMIN
═══════════════════════════════════════════════════════════════ */
export const flagFeedback = async (req, res) => {
  try {
    const { reason } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { isFlagged: true, flagReason: reason || "Flagged by admin" },
      { new: true }
    );
    if (!feedback)
      return res.status(404).json({ success: false, message: "Feedback not found" });
    return res.status(200).json({ success: true, message: "Feedback flagged", feedback });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   6. APPROVE / REJECT FEEDBACK — ADMIN
═══════════════════════════════════════════════════════════════ */
export const moderateFeedback = async (req, res) => {
  try {
    const { approve } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { isApproved: approve === true, isFlagged: false },
      { new: true }
    );
    if (!feedback)
      return res.status(404).json({ success: false, message: "Feedback not found" });
    return res.status(200).json({
      success: true,
      message: `Feedback ${approve ? "approved" : "rejected"}`,
      feedback,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   7. DELETE FEEDBACK — ADMIN
═══════════════════════════════════════════════════════════════ */
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback)
      return res.status(404).json({ success: false, message: "Feedback not found" });
    return res.status(200).json({ success: true, message: "Feedback deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ═══════════════════════════════════════════════════════════════
   8. CHECK IF USER CAN SUBMIT FEEDBACK
   Frontend calls this to show/hide feedback button
═══════════════════════════════════════════════════════════════ */
export const canSubmitFeedback = async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseData = await Case.findById(caseId);
    if (!caseData)
      return res.status(404).json({ success: false, message: "Case not found" });

    const resolvedStatuses = ["Resolved","resolved","awarded","Closed","closed"];
    const isResolved       = resolvedStatuses.includes(caseData.status);

    const alreadySubmitted = await Feedback.findOne({
      caseId,
      submittedBy: req.user.id,
    });

    return res.status(200).json({
      success:        true,
      canSubmit:      isResolved && !alreadySubmitted,
      isResolved,
      alreadySubmitted: !!alreadySubmitted,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};