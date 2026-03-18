import Case from "../models/caseModel.js";
import Meeting from "../models/meetingModel.js";
import Document from "../models/documentModel.js";
import mongoose from "mongoose";

export const getUserDashboardData = async (req, res) => {
  try {
    const userId    = req.user.id;
    const userEmail = req.user.email;

    /* ── 1. Cases filed BY this user ── */
    const raisedCases = await Case.find({
      $or: [{ createdBy: userId }, { claimant: userId }],
    })
      .populate("assignedNeutral", "name avatar")
      .populate("assignedMediator", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    /* ── 2. Cases filed AGAINST this user ── */
    const opponentCases = await Case.find({
      $or: [
        { "respondent.userId":      userId },
        { "respondent.email":       userEmail?.toLowerCase() },
        { "defendantDetails.email": userEmail },
      ],
      $and: [
        { createdBy: { $ne: userId } },
        { claimant:  { $ne: userId } },
      ],
    })
      .populate("claimant", "name avatar")
      .populate("createdBy", "name avatar")
      .populate("assignedNeutral", "name avatar")
      .sort({ createdAt: -1 })
      .lean();

    const allCases = [...raisedCases, ...opponentCases];

    /* ── 3. Stats ── */
    const activeCases = allCases.filter((c) =>
      ["in-progress","Assigned","notice-sent","mediation","arbitration","Hearing","hearing","In Review"].includes(c.status)
    ).length;

    const currentCases = allCases.filter((c) =>
      ["mediation","arbitration","Hearing","hearing"].includes(c.status)
    ).length;

    const totalCases = allCases.length;

    const latestActiveCase = allCases.find((c) =>
      ["in-progress","mediation","arbitration","Hearing","hearing"].includes(c.status)
    );

    /* ── 4. Upcoming meetings ── */
    const now = new Date();
    let upcomingMeetings = [];
    let todayMeeting     = null;

    try {
      upcomingMeetings = await Meeting.find({
        $or: [{ userId }, { participants: userId }],
        scheduledAt: { $gte: now },
      })
        .sort({ scheduledAt: 1 })
        .limit(5)
        .populate("caseId", "caseId caseTitle")
        .lean();

      const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
      const endOfDay   = new Date(now); endOfDay.setHours(23, 59, 59, 999);

      todayMeeting = await Meeting.findOne({
        $or: [{ userId }, { participants: userId }],
        scheduledAt: { $gte: startOfDay, $lte: endOfDay },
      })
        .populate("caseId", "caseId caseTitle defendantDetails petitionerDetails")
        .lean();
    } catch (meetingErr) {
      console.warn("⚠️ Meeting query failed (model may differ):", meetingErr.message);
    }

    /* ── 5. Documents — only query if there are cases ── */
    let totalDocs    = 0;
    let approvedDocs = 0;
    let recentDocs   = [];

    if (allCases.length > 0) {
      try {
        // ✅ Safely extract valid ObjectIds only
        const caseIds = allCases
          .map((c) => c._id)
          .filter((id) => id && mongoose.Types.ObjectId.isValid(id))
          .map((id) => new mongoose.Types.ObjectId(id.toString()));

        if (caseIds.length > 0) {
          totalDocs    = await Document.countDocuments({ caseId: { $in: caseIds } });
          approvedDocs = await Document.countDocuments({ caseId: { $in: caseIds }, status: "Approved" });
          recentDocs   = await Document.find({ caseId: { $in: caseIds } })
            .select("documentTitle status createdAt")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean();
        }
      } catch (docErr) {
        console.warn("⚠️ Document query failed:", docErr.message);
      }
    }

    const docProgress = totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;

    /* ── 6. Format cases for table ── */
    const formattedCases = allCases.slice(0, 10).map((c) => {
      const neutral  = c.assignedNeutral || c.assignedMediator;
      const isRaised = raisedCases.some((r) => r._id.toString() === c._id.toString());

      return {
        id:             c.caseId,
        _id:            c._id,
        title:          c.caseTitle,
        party1:         c.petitionerDetails?.fullName || "N/A",
        party2:         c.defendantDetails?.fullName  || c.respondent?.name || "N/A",
        category:       c.caseType    || "General",
        mediator:       neutral?.name || "Not Assigned",
        mediatorAvatar: neutral?.avatar || null,
        status:         c.status,
        adminStatus:    c.adminStatus,
        role:           isRaised ? "claimant" : "respondent",
        filedOn:        c.createdAt,
      };
    });

    /* ── 7. Format meetings ── */
    const formattedMeetings = upcomingMeetings.map((m) => ({
      id:     m._id,
      date:   m.scheduledAt,
      time:   m.timeSlot || "",
      title:  m.caseId?.caseTitle || m.title || "Meeting",
      caseId: m.caseId?.caseId   || "",
      link:   m.meetingLink || "",
    }));

    /* ── 8. Format today reminder ── */
    const todayReminder = todayMeeting
      ? {
          id:       todayMeeting._id,
          date:     todayMeeting.scheduledAt,
          time:     todayMeeting.timeSlot || "",
          caseId:   todayMeeting.caseId?.caseId    || "",
          title:    todayMeeting.caseId?.caseTitle  || "Meeting",
          opponent: todayMeeting.caseId?.defendantDetails?.fullName ||
                    todayMeeting.caseId?.petitionerDetails?.fullName || "N/A",
          link:     todayMeeting.meetingLink || "",
        }
      : null;

    return res.status(200).json({
      success: true,
      stats: {
        active:  activeCases,
        current: currentCases,
        total:   totalCases,
        progress: latestActiveCase
          ? { caseId: latestActiveCase.caseId, status: latestActiveCase.status }
          : null,
      },
      cases:         formattedCases,
      raisedCases:   raisedCases.length,
      opponentCases: opponentCases.length,
      meetings:      formattedMeetings,
      todayReminder,
      documents: {
        total:    totalDocs,
        approved: approvedDocs,
        progress: docProgress,
        recent:   recentDocs,
      },
    });
  } catch (error) {
    console.error("❌ getUserDashboardData error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};