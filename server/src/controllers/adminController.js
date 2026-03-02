import Case from "../models/caseModel.js";
import User from "../models/userModel.js";

/* ─────────────────────────────────────────
   USERS
───────────────────────────────────────── */

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ["user", "admin", "mediator", "case-manager"];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminInfo = async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" }).select(
      "_id name email avatar"
    );
    if (!admin) {
      return res.status(404).json({ success: false, message: "No admin found" });
    }
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch admin info" });
  }
};

/* ─────────────────────────────────────────
   CASE MANAGERS & MEDIATORS (for dropdowns)
───────────────────────────────────────── */

export const getCaseManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "case-manager" }).select(
      "_id name email avatar"
    );
    res.json({ success: true, managers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMediators = async (req, res) => {
  try {
    const mediators = await User.find({ role: "mediator" }).select(
      "_id name email avatar"
    );
    res.json({ success: true, mediators });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   CASES — ADMIN VIEW
───────────────────────────────────────── */

export const getAllCases = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { caseTitle: { $regex: search, $options: "i" } },
        { caseId: { $regex: search, $options: "i" } },
        { "petitionerDetails.fullName": { $regex: search, $options: "i" } },
      ];
    }

    const total = await Case.countDocuments(filter);
    const cases = await Case.find(filter)
      .populate("assignedCaseManager", "name email avatar")
      .populate("assignedMediator", "name email avatar")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      cases,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const caseData = await Case.findById(req.params.id)
      .populate("assignedCaseManager", "name email avatar")
      .populate("assignedMediator", "name email avatar")
      .populate("createdBy", "name email phone")
      .populate("timeline.performedBy", "name role");

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json({ success: true, case: caseData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   ASSIGN CASE MANAGER
───────────────────────────────────────── */

export const assignCaseManager = async (req, res) => {
  try {
    const { caseManagerId } = req.body;

    // Validate the user is actually a case manager
    const manager = await User.findOne({
      _id: caseManagerId,
      role: "case-manager",
    });
    if (!manager) {
      return res.status(400).json({ message: "Invalid case manager" });
    }

    const caseData = await Case.findById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    caseData.assignedCaseManager = caseManagerId;
    caseData.assignedAt = new Date();

    // Bump status if still pending
    if (caseData.status === "Pending") {
      caseData.status = "In Review";
    }

    // Audit log
    caseData.timeline.push({
      action: "Case Manager Assigned",
      performedBy: req.user.id,
      note: `Assigned to ${manager.name}`,
    });

    await caseData.save();

    res.json({
      success: true,
      message: `Case assigned to ${manager.name}`,
      case: await caseData.populate("assignedCaseManager", "name email avatar"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   ASSIGN MEDIATOR
───────────────────────────────────────── */

export const assignMediator = async (req, res) => {
  try {
    const { mediatorId } = req.body;

    const mediator = await User.findOne({ _id: mediatorId, role: "mediator" });
    if (!mediator) {
      return res.status(400).json({ message: "Invalid mediator" });
    }

    const caseData = await Case.findById(req.params.id);
    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    caseData.assignedMediator = mediatorId;

    if (["Pending", "In Review"].includes(caseData.status)) {
      caseData.status = "Assigned";
    }

    caseData.timeline.push({
      action: "Mediator Assigned",
      performedBy: req.user.id,
      note: `Assigned to ${mediator.name}`,
    });

    await caseData.save();

    res.json({
      success: true,
      message: `Mediator ${mediator.name} assigned`,
      case: await caseData.populate("assignedMediator", "name email avatar"),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   UPDATE CASE STATUS
───────────────────────────────────────── */

export const updateCaseStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const validStatuses = [
      "Pending", "In Review", "Assigned", "Hearing", "Resolved", "Rejected", "Closed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    const previousStatus = caseData.status;
    caseData.status = status;

    if (status === "Resolved") {
      caseData.resolvedAt = new Date();
    }

    caseData.timeline.push({
      action: `Status Changed: ${previousStatus} → ${status}`,
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

export const scheduleHearing = async (req, res) => {
  try {
    const { hearingDate, hearingLink, hearingNotes } = req.body;

    if (!hearingDate) {
      return res.status(400).json({ message: "Hearing date is required" });
    }

    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

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
   UPDATE PRIORITY
───────────────────────────────────────── */

export const updateCasePriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const valid = ["Low", "Medium", "High", "Urgent"];
    if (!valid.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    const caseData = await Case.findByIdAndUpdate(
      req.params.id,
      { priority },
      { new: true }
    );
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    res.json({ success: true, case: caseData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   ADD TIMELINE NOTE
───────────────────────────────────────── */

export const addTimelineNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ message: "Note is required" });

    const caseData = await Case.findById(req.params.id);
    if (!caseData) return res.status(404).json({ message: "Case not found" });

    caseData.timeline.push({
      action: "Note Added",
      performedBy: req.user.id,
      note,
    });

    await caseData.save();
    res.json({ success: true, message: "Note added", timeline: caseData.timeline });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ─────────────────────────────────────────
   DASHBOARD STATS
───────────────────────────────────────── */

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCases,
      pendingCases,
      activeCases,
      resolvedCases,
      rejectedCases,
      totalUsers,
      totalMediators,
      totalCaseManagers,
    ] = await Promise.all([
      Case.countDocuments(),
      Case.countDocuments({ status: "Pending" }),
      Case.countDocuments({ status: { $in: ["In Review", "Assigned", "Hearing"] } }),
      Case.countDocuments({ status: "Resolved" }),
      Case.countDocuments({ status: "Rejected" }),
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "mediator" }),
      User.countDocuments({ role: "case-manager" }),
    ]);

    // Cases filed in last 30 days (for trend chart)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentCases = await Case.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalCases,
        pendingCases,
        activeCases,
        resolvedCases,
        rejectedCases,
        resolutionRate:
          totalCases > 0
            ? ((resolvedCases / totalCases) * 100).toFixed(1)
            : 0,
        totalUsers,
        totalMediators,
        totalCaseManagers,
      },
      recentCases,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};