import Case from "../models/caseModel.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";

const getTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.zoho.in", port: 465, secure: true,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

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
      Case.countDocuments({ status: { $in: ["in-progress", "Assigned", "Hearing", "hearing", "mediation", "arbitration", "In Review"] } }),
      Case.countDocuments({ status: { $in: ["Resolved", "resolved"] } }),
      Case.countDocuments({ status: "awarded" }),
      Case.countDocuments({ status: { $in: ["Rejected", "rejected"] } }),
      Case.countDocuments({ isExParte: true }),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "mediator" }),
      User.countDocuments({ role: "arbitrator" }),
      User.countDocuments({ role: "case-manager" }),
    ]);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentCases = await Case.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const casesByType = await Case.aggregate([
      { $group: { _id: "$caseType", count: { $sum: 1 } } },
    ]);

    const totalSettled = resolvedCases + awardedCases;

    return res.status(200).json({
      success: true,
      stats: {
        totalCases, pendingReview, activeCases, resolvedCases,
        awardedCases, rejectedCases, exParteCases,
        resolutionRate: totalCases > 0 ? ((totalSettled / totalCases) * 100).toFixed(1) : 0,
        totalUsers, totalMediators, totalArbitrators, totalCaseManagers,
      },
      recentCases,
      casesByType,
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
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    return res.status(200).json({ success: true, total, users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["user", "admin", "mediator", "arbitrator", "case-manager"];
    if (!validRoles.includes(role))
      return res.status(400).json({ message: "Invalid role" });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false, suspendedAt: new Date(), suspendedReason: reason || "" },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ success: true, message: "User suspended", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const activateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true, suspendedAt: null, suspendedReason: "" },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ success: true, message: "User activated", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   ADMIN INFO + STAFF DROPDOWNS
════════════════════════════════════════ */
export const getAdminInfo = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" }).select("_id name email avatar");
    if (!admin) return res.status(404).json({ success: false, message: "No admin found" });
    return res.status(200).json({ success: true, admin });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCaseManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "case-manager", isActive: true }).select("_id name email avatar");
    return res.status(200).json({ success: true, managers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMediators = async (req, res) => {
  try {
    const mediators = await User.find({ role: "mediator", isActive: true }).select("_id name email avatar");
    return res.status(200).json({ success: true, mediators });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getArbitrators = async (req, res) => {
  try {
    const arbitrators = await User.find({ role: "arbitrator", isActive: true }).select("_id name email avatar");
    return res.status(200).json({ success: true, arbitrators });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   CASES — ADMIN VIEW
════════════════════════════════════════ */
export const getAllCases = async (req, res) => {
  try {
    const { status, adminStatus, caseType, priority, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status)      filter.status = status;
    if (adminStatus) filter.adminStatus = adminStatus;
    if (caseType)    filter.caseType = caseType;
    if (priority)    filter.priority = priority;
    if (search) {
      filter.$or = [
        { caseTitle: { $regex: search, $options: "i" } },
        { caseId:    { $regex: search, $options: "i" } },
      ];
    }
    const total = await Case.countDocuments(filter);
    const cases = await Case.find(filter)
      .populate("createdBy", "name email").populate("claimant", "name email")
      .populate("respondent.userId", "name email").populate("assignedCaseManager", "name email")
      .populate("assignedNeutral", "name email role")
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    return res.status(200).json({ success: true, total, cases });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id)
      .populate("createdBy", "name email").populate("claimant", "name email avatar phone")
      .populate("respondent.userId", "name email avatar phone").populate("assignedCaseManager", "name email avatar")
      .populate("assignedNeutral", "name email avatar role").populate("reviewedBy", "name email")
      .populate("timeline.performedBy", "name role");
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    return res.status(200).json({ success: true, case: caseData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   REVIEW CASE — Accept or Reject
   On accept: sends notice to respondent, starts 30-day notice period
════════════════════════════════════════ */
export const reviewCase = async (req, res) => {
  try {
    const { decision, note } = req.body;
    if (!["accepted", "rejected"].includes(decision))
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

      // Send invite email to respondent
      try {
        const inviteUrl = `${process.env.FRONTEND_URL}/accept-invite/${caseData.respondent.inviteToken}`;
        await getTransporter().sendMail({
          from:    `"RaaziMarzi" <${process.env.EMAIL_USER}>`,
          to:      caseData.respondent.email,
          subject: `⚖️ Legal Notice | Case ${caseData.caseId}`,
          html: `
            <h2>Legal Notice from RaaziMarzi</h2>
            <p>Dear ${caseData.respondent.name || "Respondent"},</p>
            <p>A case has been filed against you on the RaaziMarzi Online Dispute Resolution platform.</p>
            <p><strong>Case ID:</strong> ${caseData.caseId}</p>
            <p><strong>Case Title:</strong> ${caseData.caseTitle}</p>
            <p><strong>Response Deadline:</strong> ${caseData.noticePeriodEndAt.toDateString()}</p>
            <p>Please <a href="${inviteUrl}">click here</a> to view the case and submit your response within 30 days.</p>
            <p>If you do not respond within the notice period, the case may proceed ex-parte.</p>
            <br/><p style="color:gray;">— RaaziMarzi Dispute Resolution</p>
          `,
        });
        console.log("✅ Notice sent to respondent:", caseData.respondent.email);
      } catch (mailError) {
        console.warn("⚠️ Respondent notice email failed:", mailError.message);
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* ════════════════════════════════════════
   ASSIGN NEUTRAL (Mediator OR Arbitrator)
════════════════════════════════════════ */
export const assignNeutral = async (req, res) => {
  try {
    const { neutralId, neutralType } = req.body;
    if (!["mediator", "arbitrator"].includes(neutralType))
      return res.status(400).json({ message: "neutralType must be 'mediator' or 'arbitrator'" });

    const neutral = await User.findOne({ _id: neutralId, role: neutralType });
    if (!neutral) return res.status(400).json({ message: `Invalid ${neutralType}` });

    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    caseData.assignedNeutral = neutralId;
    caseData.neutralType     = neutralType;
    // Also keep legacy field for backward compat
    if (neutralType === "mediator") caseData.assignedMediator = neutralId;

    caseData.status = neutralType === "mediator" ? "mediation" : "arbitration";
    caseData.timeline.push({ action: `${neutralType.charAt(0).toUpperCase() + neutralType.slice(1)} Assigned`, performedBy: req.user.id, note: `${neutral.name} assigned as ${neutralType}`, isSystem: false });

    await caseData.save();
    return res.status(200).json({ success: true, message: `${neutralType} assigned`, case: caseData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* Legacy: kept for backward compat with old adminRoutes that used assignMediator */
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
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    const prev = caseData.status;
    caseData.status = status;
    if (["Resolved","resolved","awarded"].includes(status)) caseData.resolvedAt = new Date();
    caseData.timeline.push({ action: `Status: ${prev} → ${status}`, performedBy: req.user.id, note: note || "", isSystem: false });

    await caseData.save();
    return res.status(200).json({ success: true, case: caseData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateCasePriority = async (req, res) => {
  try {
    const { priority } = req.body;
    if (!["Low","Medium","High","Urgent"].includes(priority))
      return res.status(400).json({ message: "Invalid priority" });
    const caseData = await Case.findByIdAndUpdate(req.params.id, { priority }, { new: true });
    if (!caseData) return res.status(404).json({ message: "Case not found" });
    return res.status(200).json({ success: true, case: caseData });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
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
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};