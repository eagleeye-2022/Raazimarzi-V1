import Case from "../models/caseModel.js";
import nodemailer from "nodemailer";

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

    // 🔒 Basic validation
    if (!caseTitle || !petitioner?.fullName || !caseFacts?.declaration) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing or declaration not accepted",
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

    // Generate unique caseId
    const caseId = "CASE-" + Math.floor(100000 + Math.random() * 900000);

    const newCase = await Case.create({
      caseId,
      caseType,
      caseTitle,
      causeOfAction,
      reliefSought,
      caseValue,
      petitionerDetails: petitioner,
      defendantDetails: defendant,
      caseFacts,
      createdBy,
    });

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

    } catch (mailError) {
      console.warn("⚠️ Admin email failed:", mailError.message);
    }

    return res.status(201).json({
      success: true,
      message: "Case filed successfully",
      case: newCase,
    });
  } catch (error) {
    console.error("❌ Error filing case:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
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
      cases,
    });
  } catch (error) {
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
      case: updatedCase,
    });
  } catch (error) {
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
