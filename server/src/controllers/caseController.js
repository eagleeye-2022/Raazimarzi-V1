import Case from "../models/caseModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

/* ================= VALIDATION HELPERS ================= */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};

/* ================= SECURE CASE ID GENERATOR ================= */
const generateCaseId = () => {
  // Generate 10 random characters using crypto (built-in Node.js module)
  const randomString = crypto.randomBytes(5).toString('hex').toUpperCase();
  return `CASE-${randomString}`;
};

/* ================= FILE NEW CASE ================= */
export const fileNewCase = async (req, res) => {
  try {
    const {
      caseType,
      caseTitle,
      causeOfAction,
      reliefSought,
      caseValue,
      petitioner,
      defendant,
      caseFacts,
    } = req.body;

    // ✅ Enhanced validation
    if (!caseTitle || !petitioner?.fullName || !caseFacts?.declaration) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing or declaration not accepted",
      });
    }

    // ✅ Email validation
    if (!validateEmail(petitioner.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid petitioner email format",
      });
    }

    if (!validateEmail(defendant.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid defendant email format",
      });
    }

    // ✅ Phone validation
    if (!validatePhone(petitioner.mobile)) {
      return res.status(400).json({
        success: false,
        message: "Petitioner mobile number must be 10 digits",
      });
    }

    if (!validatePhone(defendant.mobile)) {
      return res.status(400).json({
        success: false,
        message: "Defendant mobile number must be 10 digits",
      });
    }

    // ✅ From auth middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const createdBy = req.user.id;

    // ✅ Generate secure unique caseId using crypto (built-in)
    const caseId = generateCaseId();

    // ✅ Sanitize inputs
    const sanitizedData = {
      caseId,
      caseType: sanitizeInput(caseType),
      caseTitle: sanitizeInput(caseTitle),
      causeOfAction: sanitizeInput(causeOfAction),
      reliefSought: sanitizeInput(reliefSought),
      caseValue: sanitizeInput(caseValue),
      petitionerDetails: {
        fullName: sanitizeInput(petitioner.fullName),
        fatherName: sanitizeInput(petitioner.fatherName),
        gender: sanitizeInput(petitioner.gender),
        dob: petitioner.dob,
        mobile: sanitizeInput(petitioner.mobile),
        email: sanitizeInput(petitioner.email),
        address: sanitizeInput(petitioner.address),
        idType: sanitizeInput(petitioner.idType),
        idProof: sanitizeInput(petitioner.idProof),
      },
      defendantDetails: {
        fullName: sanitizeInput(defendant.fullName),
        fatherName: sanitizeInput(defendant.fatherName),
        gender: sanitizeInput(defendant.gender),
        dob: defendant.dob,
        mobile: sanitizeInput(defendant.mobile),
        email: sanitizeInput(defendant.email),
        idDetails: sanitizeInput(defendant.idDetails),
      },
      caseFacts: {
        caseSummary: sanitizeInput(caseFacts.caseSummary),
        documentTitle: sanitizeInput(caseFacts.documentTitle),
        documentType: sanitizeInput(caseFacts.documentType),
        witnessDetails: sanitizeInput(caseFacts.witnessDetails),
        place: sanitizeInput(caseFacts.place),
        date: caseFacts.date,
        digitalSignature: sanitizeInput(caseFacts.digitalSignature),
        declaration: caseFacts.declaration,
      },
      createdBy,
    };

    // ✅ Create case
    const newCase = await Case.create(sanitizedData);

    /* ========== EMAIL ADMIN ========== */
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.in",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
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

      console.log("✅ Admin email sent successfully");
    } catch (mailError) {
      console.warn("⚠️ Admin email failed:", mailError.message);
      // Don't fail the request if email fails
    }

    return res.status(201).json({
      success: true,
      message: "Case filed successfully",
      case: newCase,
    });
  } catch (error) {
    console.error("❌ Error filing case:", error);
    
    // ✅ Better error responses
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(e => e.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while filing case",
    });
  }
};

/* ================= GET ALL CASES (ADMIN) ================= */
export const getAllCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cases.length,
      cases,
    });
  } catch (error) {
    console.error("❌ Error fetching all cases:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cases",
    });
  }
};

/* ================= GET SINGLE CASE ================= */
export const getCaseById = async (req, res) => {
  try {
    const singleCase = await Case.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!singleCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.status(200).json({
      success: true,
      case: singleCase,
    });
  } catch (error) {
    console.error("❌ Error fetching case:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching case",
    });
  }
};

/* ================= UPDATE CASE STATUS (ADMIN) ================= */
export const updateCaseStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ✅ Validate status
    const validStatuses = ["Pending", "In Review", "Assigned", "Resolved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedCase) {
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Case status updated successfully",
      case: updatedCase,
    });
  } catch (error) {
    console.error("❌ Error updating case status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};

/* ================= GET LOGGED-IN USER CASES ================= */
export const getUserCases = async (req, res) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // ✅ Cases raised by logged-in user
    const raisedCases = await Case.find({ createdBy: userId })
      .sort({ createdAt: -1 });

    // ✅ Cases where logged-in user is defendant
    const opponentCases = await Case.find({
      "defendantDetails.email": userEmail,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      raisedCases,
      opponentCases,
    });
  } catch (error) {
    console.error("❌ getUserCases error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user cases",
    });
  }
};