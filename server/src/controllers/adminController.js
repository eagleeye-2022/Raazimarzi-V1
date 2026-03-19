import Case     from "../models/caseModel.js";
import User     from "../models/userModel.js";
import Meeting  from "../models/meetingModel.js";
import Feedback from "../models/feedbackModel.js";
import { sendRespondentNotice }   from "../services/mail.service.js";
import { sendRespondentNoticeWA } from "../services/whatsapp.service.js";

/* ════════════════════════════════════════
   ADMIN DASHBOARD
════════════════════════════════════════ */
export const getAdminDashboard = async (req, res) => {
  try {
    const now = new Date();
    const admin = await User.findById(req.user.id).select("name email avatar");

    const [
      totalCases, activeCases, pendingReview,
      resolvedCases, awardedCases, rejectedCases,
      exParteCases, noticeSentCases,
    ] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ status: { $in: ["in-progress","Assigned","Hearing","hearing","mediation","arbitration","In Review","notice-sent"] } }),
      Case.countDocuments({ adminStatus: "pending-review" }),
      Case.countDocuments({ status: { $in: ["Resolved","resolved"] } }),
      Case.countDocuments({ status: "awarded" }),
      Case.countDocuments({ status: { $in: ["Rejected","rejected"] } }),
      Case.countDocuments({ isExParte: true }),
      Case.countDocuments({ status: "notice-sent" }),
    ]);

    const currentCases   = await Case.countDocuments({ status: { $in: ["Hearing","hearing","mediation","arbitration"] } });
    const totalSettled   = resolvedCases + awardedCases;
    const resolutionRate = totalCases > 0 ? ((totalSettled / totalCases) * 100).toFixed(1) : 0;

    const latestActiveCase = await Case.findOne({
      status: { $in: ["in-progress","mediation","arbitration","Hearing","hearing"] },
    })
      .populate("assignedNeutral",     "name avatar")
      .populate("assignedCaseManager", "name avatar")
      .populate("claimant",            "name")
      .populate("createdBy",           "name")
      .sort({ updatedAt: -1 });

    const recentCases = await Case.find()
      .populate("assignedNeutral",     "name avatar")
      .populate("assignedMediator",    "name avatar")
      .populate("assignedCaseManager", "name avatar")
      .populate("claimant",            "name email")
      .populate("createdBy",           "name email")
      .sort({ createdAt: -1 }).limit(10).lean();

    const formattedCases = recentCases.map((c) => {
      const neutral  = c.assignedNeutral || c.assignedMediator;
      const manager  = c.assignedCaseManager;
      const claimant = c.claimant || c.createdBy;
      return {
        _id: c._id, caseId: c.caseId, title: c.caseTitle,
        party1:         c.petitionerDetails?.fullName || claimant?.name || "N/A",
        party2:         c.defendantDetails?.fullName  || c.respondent?.name || "N/A",
        category:       c.caseType || "General",
        assignedTo:     neutral?.name || manager?.name || "Not Assigned",
        assignedAvatar: neutral?.avatar || manager?.avatar || null,
        status: c.status, adminStatus: c.adminStatus, filedOn: c.createdAt,
      };
    });

    const startOfDay = new Date(now); startOfDay.setHours(0,0,0,0);
    const endOfDay   = new Date(now); endOfDay.setHours(23,59,59,999);

    const todayMeetings = await Meeting.find({
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
      status:        { $in: ["Scheduled","Confirmed","In Progress"] },
    })
      .populate("caseId",   "caseId caseTitle")
      .populate("mediator", "name")
      .sort({ startTime: 1 }).limit(5).lean();

    const formattedMeetings = todayMeetings.map((m) => ({
      _id:         m._id,
      caseId:      m.caseId?.caseId   || "",
      title:       m.caseId?.caseTitle || m.meetingTitle || "Meeting",
      time:        `${m.startTime} - ${m.endTime}`,
      date:        m.scheduledDate,
      meetingWith: m.mediator?.name || "Manager",
      link:        m.virtualMeeting?.meetingLink || "",
      status:      m.status,
    }));

    let caseProgress = null;
    if (latestActiveCase) {
      const phaseMap = {
        "notice-sent": { phase:"Phase 1", percent:20 },
        "in-progress": { phase:"Phase 2", percent:40 },
        "mediation":   { phase:"Phase 3", percent:60 },
        "arbitration": { phase:"Phase 3", percent:60 },
        "Hearing":     { phase:"Phase 4", percent:80 },
        "hearing":     { phase:"Phase 4", percent:80 },
        "awarded":     { phase:"Phase 5", percent:100 },
        "resolved":    { phase:"Phase 5", percent:100 },
        "Resolved":    { phase:"Phase 5", percent:100 },
      };
      const phase = phaseMap[latestActiveCase.status] || { phase:"Phase 1", percent:20 };
      caseProgress = {
        _id: latestActiveCase._id, caseId: latestActiveCase.caseId,
        title: latestActiveCase.caseTitle, status: latestActiveCase.status,
        phase: phase.phase, phasePercent: phase.percent,
        filingFeePaid: latestActiveCase.filingFeePaid || false,
        filingFee:     latestActiveCase.filingFee     || 0,
        party1:   latestActiveCase.petitionerDetails?.fullName || latestActiveCase.claimant?.name || "N/A",
        party2:   latestActiveCase.defendantDetails?.fullName  || latestActiveCase.respondent?.name || "N/A",
        mediator: latestActiveCase.assignedNeutral?.name    || "Not Assigned",
        manager:  latestActiveCase.assignedCaseManager?.name || "Not Assigned",
        category: latestActiveCase.caseType || "General",
      };
    }

    const casesByType   = await Case.aggregate([{ $group: { _id: "$caseType", count: { $sum: 1 } } }]);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentTrend   = await Case.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format:"%Y-%m-%d", date:"$createdAt" } }, count: { $sum:1 } } },
      { $sort: { _id: 1 } },
    ]);

    /* ── 9. Recent feedback ── */
    const recentFeedback = await Feedback.find({ isApproved: true, isPublic: true })
      .populate("submittedBy", "name avatar")
      .populate("caseId",      "caseId caseTitle")
      .sort({ createdAt: -1 })
      .limit(5);

    const feedbackStats = await Feedback.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: "$overallRating" }, count: { $sum: 1 } } },
    ]);

    return res.status(200).json({
      success: true,
      admin:   { name: admin?.name || "Admin", email: admin?.email || "", avatar: admin?.avatar || "" },
      stats:   { active: activeCases, current: currentCases, total: totalCases, pendingReview, resolved: resolvedCases, awarded: awardedCases, rejected: rejectedCases, exParte: exParteCases, noticeSent: noticeSentCases, resolutionRate },
      cases: formattedCases, todayMeetings: formattedMeetings,
      caseProgress, casesByType, recentTrend,
      feedback: {
        recent:    recentFeedback,
        avgRating: feedbackStats[0]?.avgRating?.toFixed(1) || "0",
        total:     feedbackStats[0]?.count || 0,
      },
    });
  } catch (error) {
    console.error("❌ getAdminDashboard error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ════════════════════════════════════════
   DASHBOARD STATS
════════════════════════════════════════ */
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCases, pendingReview, activeCases, resolvedCases,
      awardedCases, rejectedCases, exParteCases,
      totalUsers, totalMediators, totalArbitrators, totalCaseManagers,
    ] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ adminStatus: "pending-review" }),
      Case.countDocuments({ status: { $in: ["in-progress","Assigned","Hearing","hearing","mediation","arbitration","In Review"] } }),
      Case.countDocuments({ status: { $in: ["Resolved","resolved"] } }),
      Case.countDocuments({ status: "awarded" }),
      Case.countDocuments({ status: { $in: ["Rejected","rejected"] } }),
      Case.countDocuments({ isExParte: true }),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "mediator" }),
      User.countDocuments({ role: "arbitrator" }),
      User.countDocuments({ role: "case-manager" }),
    ]);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentCases   = await Case.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format:"%Y-%m-%d", date:"$createdAt" } }, count: { $sum:1 } } },
      { $sort: { _id: 1 } },
    ]);
    const casesByType  = await Case.aggregate([{ $group: { _id: "$caseType", count: { $sum:1 } } }]);
    const totalSettled = resolvedCases + awardedCases;

    return res.status(200).json({
      success: true,
      stats: {
        totalCases, pendingReview, activeCases, resolvedCases, awardedCases,
        rejectedCases, exParteCases,
        resolutionRate: totalCases > 0 ? ((totalSettled / totalCases) * 100).toFixed(1) : 0,
        totalUsers, totalMediators, totalArbitrators, totalCaseManagers,
      },
      recentCases, casesByType,
    });
  } catch (error) {
    console.error("❌ getDashboardStats error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   USERS
════════════════════════════════════════ */
export const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex:search, $options:"i" } }, { email: { $regex:search, $options:"i" } }];
    const total = await User.countDocuments(filter);
    const users = await User.find(filter).select("-password").sort({ createdAt:-1 }).skip((page-1)*limit).limit(Number(limit));
    return res.status(200).json({ success: true, total, users });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user","admin","mediator","arbitrator","case-manager"].includes(role))
      return res.status(400).json({ message: "Invalid role" });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new:true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const suspendUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id,
      { isActive: false, suspendedAt: new Date(), suspendedReason: reason || "" },
      { new:true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ success: true, message: "User suspended", user });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id,
      { isActive: true, suspendedAt: null, suspendedReason: "" },
      { new:true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ success: true, message: "User activated", user });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

/* ════════════════════════════════════════
   ADMIN INFO + STAFF DROPDOWNS
════════════════════════════════════════ */
export const getAdminInfo = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" }).select("_id name email avatar");
    if (!admin) return res.status(404).json({ success: false, message: "No admin found" });
    return res.status(200).json({ success: true, admin });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const getCaseManagers = async (req, res) => {
  try {
    const managers = await User.find({ role:"case-manager", isActive:true }).select("_id name email avatar");
    return res.status(200).json({ success: true, managers });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const getMediators = async (req, res) => {
  try {
    const mediators = await User.find({ role:"mediator", isActive:true }).select("_id name email avatar");
    return res.status(200).json({ success: true, mediators });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const getArbitrators = async (req, res) => {
  try {
    const arbitrators = await User.find({ role:"arbitrator", isActive:true }).select("_id name email avatar");
    return res.status(200).json({ success: true, arbitrators });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

/* ════════════════════════════════════════
   CASES — ADMIN VIEW
════════════════════════════════════════ */
export const getAllCases = async (req, res) => {
  try {
    const { status, adminStatus, caseType, priority, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status)      filter.status      = status;
    if (adminStatus) filter.adminStatus = adminStatus;
    if (caseType)    filter.caseType    = caseType;
    if (priority)    filter.priority    = priority;
    if (search)      filter.$or = [{ caseTitle: { $regex:search, $options:"i" } }, { caseId: { $regex:search, $options:"i" } }];
    const total = await Case.countDocuments(filter);
    const cases = await Case.find(filter)
      .populate("createdBy","name email").populate("claimant","name email")
      .populate("respondent.userId","name email").populate("assignedCaseManager","name email")
      .populate("assignedNeutral","name email role")
      .sort({ createdAt:-1 }).skip((page-1)*limit).limit(Number(limit));
    return res.status(200).json({ success: true, total, cases });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id)
      .populate("createdBy","name email").populate("claimant","name email avatar phone")
      .populate("respondent.userId","name email avatar phone").populate("assignedCaseManager","name email avatar")
      .populate("assignedNeutral","name email avatar role").populate("reviewedBy","name email")
      .populate("timeline.performedBy","name role");
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    return res.status(200).json({ success: true, case: caseData });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

/* ════════════════════════════════════════
   REVIEW CASE
   ✅ Uses mail.service + whatsapp.service
   Email + WhatsApp/SMS both sent on accept
════════════════════════════════════════ */
export const reviewCase = async (req, res) => {
  try {
    const { decision, note } = req.body;
    if (!["accepted","rejected"].includes(decision))
      return res.status(400).json({ message: "Decision must be 'accepted' or 'rejected'" });

    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    if (caseData.adminStatus !== "pending-review")
      return res.status(400).json({ message: "Case already reviewed" });

    caseData.adminStatus = decision;
    caseData.adminNote   = note || "";
    caseData.reviewedBy  = req.user.id;
    caseData.reviewedAt  = new Date();

    if (decision === "accepted") {
      caseData.status = "notice-sent";
      const now = new Date();
      caseData.noticePeriodStartAt = now;
      caseData.noticePeriodEndAt   = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      caseData.noticesSent.push({ sentAt: now, channel: "email", noticeNo: 1, message: "Initial notice sent to respondent" });
      caseData.timeline.push({ action: "Case Accepted by Admin", performedBy: req.user.id, note: "30-day notice period started", isSystem: false });

      const respondentPhone = caseData.respondent?.phone || caseData.defendantDetails?.mobile;
      const deadlineDate    = caseData.noticePeriodEndAt.toDateString();

      /* ── Email notice ── */
      await sendRespondentNotice({
        to:          caseData.respondent.email,
        name:        caseData.respondent.name,
        caseId:      caseData.caseId,
        caseTitle:   caseData.caseTitle,
        noticeNo:    1,
        deadlineDate,
        inviteToken: caseData.respondent.inviteToken,
      });

      /* ── WhatsApp/SMS notice ── */
      if (respondentPhone) {
        await sendRespondentNoticeWA({
          phone:       respondentPhone,
          name:        caseData.respondent.name,
          caseId:      caseData.caseId,
          caseTitle:   caseData.caseTitle,
          noticeNo:    1,
          deadlineDate,
          inviteToken: caseData.respondent.inviteToken,
        });
      }

    } else {
      caseData.status = "Rejected";
      caseData.timeline.push({ action: "Case Rejected by Admin", performedBy: req.user.id, note: note || "Rejected", isSystem: false });
    }

    await caseData.save();
    return res.status(200).json({ success: true, message: `Case ${decision}`, case: caseData });
  } catch (error) {
    console.error("❌ reviewCase error:", error);
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   DECLARE EX-PARTE
════════════════════════════════════════ */
export const declareExParte = async (req, res) => {
  try {
    const { reason } = req.body;
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    if (caseData.respondent.inviteStatus === "accepted")
      return res.status(400).json({ message: "Respondent has already joined — cannot declare ex-parte" });
    if (caseData.isExParte)
      return res.status(400).json({ message: "Already declared ex-parte" });
    caseData.isExParte     = true;
    caseData.exParteAt     = new Date();
    caseData.exParteReason = reason || "Respondent did not respond within notice period";
    caseData.status        = "in-progress";
    caseData.timeline.push({ action: "Ex-Parte Declared", performedBy: req.user.id, note: caseData.exParteReason, isSystem: false });
    await caseData.save();
    return res.status(200).json({ success: true, message: "Ex-parte declared", case: caseData });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

/* ════════════════════════════════════════
   ASSIGN CASE MANAGER
════════════════════════════════════════ */
export const assignCaseManager = async (req, res) => {
  try {
    const { caseManagerId } = req.body;
    const manager = await User.findOne({ _id: caseManagerId, role: "case-manager" });
    if (!manager) return res.status(400).json({ message: "Invalid case manager" });
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    caseData.assignedCaseManager = caseManagerId;
    caseData.assignedAt          = new Date();
    caseData.timeline.push({ action: "Case Manager Assigned", performedBy: req.user.id, note: `Assigned to ${manager.name}`, isSystem: false });
    await caseData.save();
    return res.status(200).json({ success: true, message: `Assigned to ${manager.name}` });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

/* ════════════════════════════════════════
   ASSIGN NEUTRAL
════════════════════════════════════════ */
export const assignNeutral = async (req, res) => {
  try {
    const { neutralId, neutralType } = req.body;
    if (!["mediator","arbitrator"].includes(neutralType))
      return res.status(400).json({ message: "neutralType must be 'mediator' or 'arbitrator'" });
    const neutral = await User.findOne({ _id: neutralId, role: neutralType });
    if (!neutral) return res.status(400).json({ message: `Invalid ${neutralType}` });
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    caseData.assignedNeutral = neutralId;
    caseData.neutralType     = neutralType;
    if (neutralType === "mediator") caseData.assignedMediator = neutralId;
    caseData.status = neutralType === "mediator" ? "mediation" : "arbitration";
    caseData.timeline.push({ action: `${neutralType.charAt(0).toUpperCase() + neutralType.slice(1)} Assigned`, performedBy: req.user.id, note: `${neutral.name} assigned as ${neutralType}`, isSystem: false });
    await caseData.save();
    return res.status(200).json({ success: true, message: `${neutralType} assigned`, case: caseData });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const assignMediator = async (req, res) => {
  req.body.neutralType = "mediator";
  req.body.neutralId   = req.body.mediatorId;
  return assignNeutral(req, res);
};

/* ════════════════════════════════════════
   UPDATE STATUS / PRIORITY / HEARING / NOTE
════════════════════════════════════════ */
export const updateCaseStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = ["Pending","pending-review","In Review","notice-sent","in-progress","Assigned","Hearing","hearing","mediation","arbitration","Resolved","resolved","awarded","Rejected","rejected","withdrawn","Closed","closed"];
    if (!validStatuses.includes(status)) return res.status(400).json({ message: "Invalid status" });
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    const prev = caseData.status;
    caseData.status = status;
    if (["Resolved","resolved","awarded"].includes(status)) caseData.resolvedAt = new Date();
    caseData.timeline.push({ action: `Status: ${prev} → ${status}`, performedBy: req.user.id, note: note || "", isSystem: false });
    await caseData.save();
    return res.status(200).json({ success: true, case: caseData });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const updateCasePriority = async (req, res) => {
  try {
    const { priority } = req.body;
    if (!["Low","Medium","High","Urgent"].includes(priority)) return res.status(400).json({ message: "Invalid priority" });
    const caseData = await Case.findByIdAndUpdate(req.params.id, { priority }, { new:true });
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    return res.status(200).json({ success: true, case: caseData });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const scheduleHearing = async (req, res) => {
  try {
    const { hearingDate, hearingLink, hearingNotes } = req.body;
    if (!hearingDate) return res.status(400).json({ message: "Hearing date required" });
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    caseData.hearingDate  = new Date(hearingDate);
    caseData.hearingLink  = hearingLink  || "";
    caseData.hearingNotes = hearingNotes || "";
    caseData.status       = "Hearing";
    caseData.timeline.push({ action: "Hearing Scheduled", performedBy: req.user.id, note: `Scheduled for ${new Date(hearingDate).toUTCString()}`, isSystem: false });
    await caseData.save();
    return res.status(200).json({ success: true, case: caseData });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

export const addTimelineNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ message: "Note is required" });
    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    caseData.timeline.push({ action: "Note Added", performedBy: req.user.id, note, isSystem: false });
    await caseData.save();
    return res.status(200).json({ success: true, timeline: caseData.timeline });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};

/* ════════════════════════════════════════
   GET CASE PROGRESS BY ID
════════════════════════════════════════ */
export const getCaseProgress = async (req, res) => {
  try {
    const { caseId } = req.params;
    const caseData = await Case.findOne({ caseId })
      .populate("assignedNeutral",     "name avatar")
      .populate("assignedCaseManager", "name avatar")
      .populate("claimant",            "name")
      .populate("createdBy",           "name");
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    const phaseMap = {
      "notice-sent": { phase:"Phase 1", percent:20 },
      "in-progress": { phase:"Phase 2", percent:40 },
      "mediation":   { phase:"Phase 3", percent:60 },
      "arbitration": { phase:"Phase 3", percent:60 },
      "Hearing":     { phase:"Phase 4", percent:80 },
      "hearing":     { phase:"Phase 4", percent:80 },
      "awarded":     { phase:"Phase 5", percent:100 },
      "resolved":    { phase:"Phase 5", percent:100 },
      "Resolved":    { phase:"Phase 5", percent:100 },
    };
    const phase = phaseMap[caseData.status] || { phase:"Phase 1", percent:20 };

    return res.status(200).json({
      success: true,
      progress: {
        _id: caseData._id, caseId: caseData.caseId, title: caseData.caseTitle,
        status: caseData.status, phase: phase.phase, phasePercent: phase.percent,
        filingFeePaid: caseData.filingFeePaid || false, filingFee: caseData.filingFee || 0,
        party1:   caseData.petitionerDetails?.fullName || caseData.claimant?.name || "N/A",
        party2:   caseData.defendantDetails?.fullName  || caseData.respondent?.name || "N/A",
        mediator: caseData.assignedNeutral?.name    || "Not Assigned",
        manager:  caseData.assignedCaseManager?.name || "Not Assigned",
        category: caseData.caseType || "General",
      },
    });
  } catch (error) { return res.status(500).json({ message: error.message }); }
};