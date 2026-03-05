import Case, { CASE_PREFIXES } from "../models/caseModel.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};
const generateCaseId = (caseType) => {
  const prefix = CASE_PREFIXES[caseType] || "CS";
  const year   = new Date().getFullYear();
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${prefix}-${year}-${random}`;
};
const generateInviteToken = () => crypto.randomBytes(32).toString("hex");
const getTransporter = () => nodemailer.createTransport({
  host: "smtp.zoho.in", port: 465, secure: true,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const fileNewCase = async (req, res) => {
  try {
    const { caseType, caseTitle, causeOfAction, reliefSought, caseValue, petitioner, defendant, caseFacts } = req.body;
    if (!caseTitle || !petitioner?.fullName || !caseFacts?.declaration)
      return res.status(400).json({ success: false, message: "Required fields missing or declaration not accepted" });
    if (!validateEmail(petitioner.email))
      return res.status(400).json({ success: false, message: "Invalid petitioner email format" });
    if (!validateEmail(defendant.email))
      return res.status(400).json({ success: false, message: "Invalid defendant email format" });
    if (!validatePhone(petitioner.mobile))
      return res.status(400).json({ success: false, message: "Petitioner mobile must be 10 digits" });
    if (!validatePhone(defendant.mobile))
      return res.status(400).json({ success: false, message: "Defendant mobile must be 10 digits" });
    if (!req.user?.id)
      return res.status(401).json({ success: false, message: "Unauthorized" });
    if (defendant.email?.toLowerCase() === req.user.email?.toLowerCase())
      return res.status(400).json({ success: false, message: "You cannot file a case against yourself" });

    const createdBy    = req.user.id;
    const caseId       = generateCaseId(caseType);
    const inviteToken  = generateInviteToken();
    const existingResp = await User.findOne({ email: defendant.email.toLowerCase() });

    const newCase = await Case.create({
      caseId,
      caseType: sanitizeInput(caseType), caseTitle: sanitizeInput(caseTitle),
      causeOfAction: sanitizeInput(causeOfAction), reliefSought: sanitizeInput(reliefSought),
      caseValue: sanitizeInput(caseValue),
      petitionerDetails: {
        fullName: sanitizeInput(petitioner.fullName), fatherName: sanitizeInput(petitioner.fatherName),
        gender: sanitizeInput(petitioner.gender), dob: petitioner.dob,
        mobile: sanitizeInput(petitioner.mobile), email: sanitizeInput(petitioner.email),
        address: sanitizeInput(petitioner.address), idType: sanitizeInput(petitioner.idType),
        idProof: sanitizeInput(petitioner.idProof),
      },
      defendantDetails: {
        fullName: sanitizeInput(defendant.fullName), fatherName: sanitizeInput(defendant.fatherName),
        gender: sanitizeInput(defendant.gender), dob: defendant.dob,
        mobile: sanitizeInput(defendant.mobile), email: sanitizeInput(defendant.email),
        idDetails: sanitizeInput(defendant.idDetails),
      },
      caseFacts: {
        caseSummary: sanitizeInput(caseFacts.caseSummary), documentTitle: sanitizeInput(caseFacts.documentTitle),
        documentType: sanitizeInput(caseFacts.documentType), witnessDetails: sanitizeInput(caseFacts.witnessDetails),
        place: sanitizeInput(caseFacts.place), date: caseFacts.date,
        digitalSignature: sanitizeInput(caseFacts.digitalSignature), declaration: caseFacts.declaration,
      },
      claimant: createdBy,
      respondent: {
        userId: existingResp?._id || null, email: defendant.email.toLowerCase(),
        phone: defendant.mobile || "", name: defendant.fullName || "",
        inviteToken, inviteStatus: "pending", inviteSentAt: new Date(),
      },
      createdBy, status: "Pending", adminStatus: "pending-review",
      timeline: [{ action: "Case Filed", performedBy: createdBy, note: `${caseType || "New"} case filed`, isSystem: false }],
    });

    try {
      await getTransporter().sendMail({
        from: `"RaaziMarzi" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `📁 New Case Filed | ${caseId}`,
        html: `
          <h2>📂 New Case Filed</h2>
          <hr />

          <h3>🧾 Case Details</h3>
          <p><strong>Case ID:</strong> ${caseId}</p>
          <p><strong>Case Type:</strong> ${caseType || "N/A"}</p>
          <p><strong>Title:</strong> ${caseTitle}</p>
          <p><strong>Cause of Action:</strong> ${causeOfAction || "N/A"}</p>
          <p><strong>Relief Sought:</strong> ${reliefSought || "N/A"}</p>
          <p><strong>Case Value:</strong> ${caseValue || "N/A"}</p>

          <hr />

          <h3>👤 Petitioner Details</h3>
          <p><strong>Name:</strong> ${petitioner?.fullName}</p>
          <p><strong>Father/Spouse:</strong> ${petitioner?.fatherName || "N/A"}</p>
          <p><strong>Gender:</strong> ${petitioner?.gender}</p>
          <p><strong>DOB:</strong> ${petitioner?.dob}</p>
          <p><strong>Mobile:</strong> ${petitioner?.mobile}</p>
          <p><strong>Email:</strong> ${petitioner?.email}</p>
          <p><strong>Address:</strong> ${petitioner?.address || "N/A"}</p>
          <p><strong>ID Proof:</strong> ${petitioner?.idType || ""} ${petitioner?.idProof || ""}</p>

          <hr />

          <h3>👥 Defendant Details</h3>
          <p><strong>Name:</strong> ${defendant?.fullName}</p>
          <p><strong>Father/Spouse:</strong> ${defendant?.fatherName || "N/A"}</p>
          <p><strong>Gender:</strong> ${defendant?.gender || "N/A"}</p>
          <p><strong>DOB:</strong> ${defendant?.dob || "N/A"}</p>
          <p><strong>Mobile:</strong> ${defendant?.mobile}</p>
          <p><strong>Email:</strong> ${defendant?.email}</p>
          <p><strong>ID Details:</strong> ${defendant?.idDetails || "N/A"}</p>

          <hr />

          <h3>📑 Case Facts & Evidence</h3>
          <p><strong>Summary:</strong> ${caseFacts?.caseSummary || "N/A"}</p>
          <p><strong>Document Title:</strong> ${caseFacts?.documentTitle || "N/A"}</p>
          <p><strong>Document Type:</strong> ${caseFacts?.documentType || "N/A"}</p>
          <p><strong>Witness Details:</strong> ${caseFacts?.witnessDetails || "N/A"}</p>
          <p><strong>Place:</strong> ${caseFacts?.place || "N/A"}</p>
          <p><strong>Date:</strong> ${caseFacts?.date || "N/A"}</p>

          <hr />

          <h3>👨‍💼 Filed By</h3>
          <p><strong>User Email:</strong> ${req.user.email}</p>
          <p><strong>Filed At:</strong> ${new Date().toLocaleString()}</p>

          <br />
          <p style="color:gray;">— RaaziMarzi System</p>
        `,
      });
      console.log("✅ Admin email sent successfully for case:", caseId);
    } catch (mailError) {
      console.warn("⚠️ Admin email failed:", mailError.message);
    }

    return res.status(201).json({ success: true, message: "Case filed successfully", case: newCase });
  } catch (error) {
    console.error("❌ fileNewCase error:", error);
    if (error.name === "ValidationError")
      return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map((e) => e.message) });
    return res.status(500).json({ success: false, message: "Server error while filing case" });
  }
};

export const getAllCases = async (req, res) => {
  try {
    const { status, caseType, adminStatus, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (caseType) filter.caseType = caseType;
    if (adminStatus) filter.adminStatus = adminStatus;
    if (search) filter.$or = [{ caseTitle: { $regex: search, $options: "i" } }, { caseId: { $regex: search, $options: "i" } }];
    const total = await Case.countDocuments(filter);
    const cases = await Case.find(filter)
      .populate("createdBy", "name email role").populate("claimant", "name email")
      .populate("respondent.userId", "name email").populate("assignedCaseManager", "name email")
      .populate("assignedNeutral", "name email role")
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    return res.status(200).json({ success: true, count: cases.length, total, cases });
  } catch (error) {
    console.error("❌ getAllCases error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch cases" });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const singleCase = await Case.findById(req.params.id)
      .populate("createdBy", "name email").populate("claimant", "name email avatar phone")
      .populate("respondent.userId", "name email avatar phone").populate("assignedCaseManager", "name email avatar")
      .populate("assignedNeutral", "name email avatar role").populate("timeline.performedBy", "name role");
    if (!singleCase) return res.status(404).json({ success: false, message: "Case not found" });
    return res.status(200).json({ success: true, case: singleCase });
  } catch (error) {
    console.error("❌ getCaseById error:", error);
    return res.status(500).json({ success: false, message: "Error fetching case" });
  }
};

export const updateCaseStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending","pending-review","In Review","notice-sent","in-progress","Assigned","Hearing","hearing","mediation","arbitration","Resolved","resolved","awarded","Rejected","rejected","withdrawn","Closed","closed"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid status value" });
    const updatedCase = await Case.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updatedCase) return res.status(404).json({ success: false, message: "Case not found" });
    return res.status(200).json({ success: true, message: "Status updated", case: updatedCase });
  } catch (error) {
    console.error("❌ updateCaseStatus error:", error);
    return res.status(500).json({ success: false, message: "Failed to update status" });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authorized" });
    const baseUrl   = process.env.API_URL || `${req.protocol}://${req.get("host")}`;
    const avatarUrl = req.user.avatar ? `${baseUrl}/uploads/avatars/${req.user.avatar}` : "";
    return res.status(200).json({ success: true, _id: req.user._id, name: req.user.name, fullName: req.user.name, email: req.user.email, role: req.user.role, avatar: avatarUrl });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserCases = async (req, res) => {
  try {
    const userId = req.user?.id, userEmail = req.user?.email;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const raisedCases = await Case.find({ $or: [{ createdBy: userId }, { claimant: userId }] })
      .populate("assignedCaseManager", "name email").populate("assignedNeutral", "name email role")
      .sort({ createdAt: -1 }).lean();
    let opponentCases = [];
    if (userEmail) {
      opponentCases = await Case.find({
        $or: [{ "respondent.userId": userId }, { "respondent.email": userEmail.toLowerCase() }, { "defendantDetails.email": userEmail }],
        $and: [{ createdBy: { $ne: userId } }, { claimant: { $ne: userId } }],
      }).populate("claimant", "name email").populate("createdBy", "name email").populate("assignedNeutral", "name email role")
        .sort({ createdAt: -1 }).lean();
    }
    return res.status(200).json({ success: true, raisedCases, opponentCases });
  } catch (error) {
    console.error("❌ getUserCases error:", error);
    return res.status(500).json({ success: false, message: "Error fetching user cases" });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const caseData = await Case.findOne({ "respondent.inviteToken": req.params.token, "respondent.inviteStatus": "pending" });
    if (!caseData) return res.status(400).json({ success: false, message: "Invalid or expired invite link" });
    caseData.respondent.userId = req.user.id;
    caseData.respondent.inviteStatus = "accepted";
    caseData.respondent.acceptedAt = new Date();
    caseData.respondent.inviteToken = null;
    if (caseData.status === "notice-sent") caseData.status = "in-progress";
    caseData.timeline.push({ action: "Respondent Accepted Invite", performedBy: req.user.id, note: `${req.user.name} joined as respondent`, isSystem: false });
    await caseData.save();
    return res.status(200).json({ success: true, message: "You have joined the case", case: caseData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const submitResponse = async (req, res) => {
  try {
    const { responseText } = req.body;
    if (!responseText) return res.status(400).json({ success: false, message: "Response text is required" });
    const caseData = await Case.findOne({ _id: req.params.id, $or: [{ "respondent.userId": req.user.id }, { "respondent.email": req.user.email?.toLowerCase() }, { "defendantDetails.email": req.user.email }] });
    if (!caseData) return res.status(404).json({ success: false, message: "Case not found or access denied" });
    if (caseData.respondent.responseSubmittedAt) return res.status(400).json({ success: false, message: "Response already submitted" });
    caseData.respondent.responseText = responseText;
    caseData.respondent.responseSubmittedAt = new Date();
    caseData.timeline.push({ action: "Respondent Submitted Response", performedBy: req.user.id, note: "Formal response submitted", isSystem: false });
    await caseData.save();
    return res.status(200).json({ success: true, message: "Response submitted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const withdrawCase = async (req, res) => {
  try {
    const caseData = await Case.findOne({ _id: req.params.id, $or: [{ createdBy: req.user.id }, { claimant: req.user.id }] });
    if (!caseData) return res.status(404).json({ success: false, message: "Case not found" });
    const nonWithdrawable = ["Resolved","resolved","awarded","Closed","closed","withdrawn","Rejected","rejected"];
    if (nonWithdrawable.includes(caseData.status)) return res.status(400).json({ success: false, message: `Cannot withdraw: ${caseData.status}` });
    caseData.status = "withdrawn";
    caseData.timeline.push({ action: "Case Withdrawn", performedBy: req.user.id, note: req.body.reason || "Withdrawn by claimant", isSystem: false });
    await caseData.save();
    return res.status(200).json({ success: true, message: "Case withdrawn successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCaseTimeline = async (req, res) => {
  try {
    const caseData = await Case.findOne({ _id: req.params.id, $or: [{ createdBy: req.user.id }, { claimant: req.user.id }, { "respondent.userId": req.user.id }, { "respondent.email": req.user.email?.toLowerCase() }] })
      .populate("timeline.performedBy", "name role");
    if (!caseData) return res.status(404).json({ success: false, message: "Case not found" });
    return res.status(200).json({ success: true, timeline: caseData.timeline });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};