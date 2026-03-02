import Document from "../models/documentModel.js";
import Case from "../models/caseModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ═══════════════════════════════════════════════════════════════
   HELPER: Check if user has access to a case
═══════════════════════════════════════════════════════════════ */
const canAccessCase = async (userId, caseId, userRole) => {
  if (userRole === "admin") return true;

  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) return false;

  // User created the case
  if (caseDoc.createdBy.toString() === userId.toString()) return true;

  // User is defendant
  const userEmail = await getUserEmail(userId);
  if (caseDoc.defendantDetails?.email === userEmail) return true;

  return false;
};

const getUserEmail = async (userId) => {
  const User = (await import("../models/userModel.js")).default;
  const user = await User.findById(userId);
  return user?.email;
};

/* ═══════════════════════════════════════════════════════════════
   1. UPLOAD DOCUMENT
═══════════════════════════════════════════════════════════════ */
export const uploadDocument = async (req, res) => {
  try {
    const {
      documentTitle,
      description,
      category,
      caseId,
      accessControl,
      tags,
      isConfidential,
    } = req.body;

    // ✅ Validation
    if (!documentTitle || !category || !caseId) {
      return res.status(400).json({
        success: false,
        message: "Document title, category, and case ID are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // ✅ Verify case exists and user has access
    const caseExists = await Case.findById(caseId);
    if (!caseExists) {
      // Delete uploaded file if case doesn't exist
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "Case not found",
      });
    }

    const hasAccess = await canAccessCase(req.user._id, caseId, req.user.role);
    if (!hasAccess) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({
        success: false,
        message: "You don't have access to this case",
      });
    }

    // ✅ Create document record
    const document = await Document.create({
      documentTitle: documentTitle.trim(),
      description: description?.trim(),
      category,
      originalFileName: req.file.originalname,
      storedFileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      fileExtension: path.extname(req.file.originalname).toLowerCase(),
      caseId,
      uploadedBy: req.user._id,
      accessControl: accessControl || "case-parties",
      tags: tags ? JSON.parse(tags) : [],
      isConfidential: isConfidential === "true",
    });

    const populatedDoc = await Document.findById(document._id)
      .populate("uploadedBy", "name email")
      .populate("caseId", "caseId caseTitle");

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: populatedDoc,
    });
  } catch (error) {
    console.error("❌ Upload document error:", error);
    
    // Clean up file if DB save failed
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   2. GET DOCUMENTS BY CASE
═══════════════════════════════════════════════════════════════ */
export const getDocumentsByCase = async (req, res) => {
  try {
    const { caseId } = req.params;

    // ✅ Verify access
    const hasAccess = await canAccessCase(req.user._id, caseId, req.user.role);
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ✅ Fetch documents
    const documents = await Document.find({ caseId })
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    // ✅ Filter by access control (non-admins can't see admin-only docs)
    const filteredDocs = documents.filter((doc) =>
      doc.canAccess(req.user._id, req.user.role)
    );

    res.status(200).json({
      success: true,
      count: filteredDocs.length,
      documents: filteredDocs,
    });
  } catch (error) {
    console.error("❌ Get documents error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   3. GET SINGLE DOCUMENT
═══════════════════════════════════════════════════════════════ */
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email")
      .populate("caseId", "caseId caseTitle");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ✅ Check access
    const hasAccess = document.canAccess(req.user._id, req.user.role);
    const hasCaseAccess = await canAccessCase(
      req.user._id,
      document.caseId._id,
      req.user.role
    );

    if (!hasAccess || !hasCaseAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ✅ Record view in audit trail
    const ipAddress = req.ip || req.connection.remoteAddress;
    await document.recordView(req.user._id, ipAddress);

    res.status(200).json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("❌ Get document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch document",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   4. DOWNLOAD DOCUMENT
═══════════════════════════════════════════════════════════════ */
export const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ✅ Check access
    const hasAccess = document.canAccess(req.user._id, req.user.role);
    const hasCaseAccess = await canAccessCase(
      req.user._id,
      document.caseId,
      req.user.role
    );

    if (!hasAccess || !hasCaseAccess) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ✅ Check file exists
    if (!fs.existsSync(document.filePath)) {
      return res.status(404).json({
        success: false,
        message: "File not found on server",
      });
    }

    // ✅ Record download
    await document.recordDownload();

    // ✅ Send file
    res.download(document.filePath, document.originalFileName);
  } catch (error) {
    console.error("❌ Download document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to download document",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   5. UPDATE DOCUMENT (metadata only)
═══════════════════════════════════════════════════════════════ */
export const updateDocument = async (req, res) => {
  try {
    const { documentTitle, description, category, tags, accessControl } = req.body;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ✅ Only uploader or admin can update
    if (
      req.user.role !== "admin" &&
      document.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ✅ Update fields
    if (documentTitle) document.documentTitle = documentTitle.trim();
    if (description !== undefined) document.description = description.trim();
    if (category) document.category = category;
    if (tags) document.tags = JSON.parse(tags);
    if (accessControl) document.accessControl = accessControl;

    await document.save();

    const updated = await Document.findById(document._id)
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Document updated successfully",
      document: updated,
    });
  } catch (error) {
    console.error("❌ Update document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update document",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   6. DELETE DOCUMENT
═══════════════════════════════════════════════════════════════ */
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // ✅ Only uploader or admin can delete
    if (
      req.user.role !== "admin" &&
      document.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ✅ Delete file from filesystem
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // ✅ Delete previous versions
    for (const version of document.previousVersions) {
      if (fs.existsSync(version.filePath)) {
        fs.unlinkSync(version.filePath);
      }
    }

    // ✅ Delete from DB
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete document",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   7. APPROVE DOCUMENT (ADMIN ONLY)
═══════════════════════════════════════════════════════════════ */
export const approveDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    document.status = "Approved";
    document.approvedBy = req.user._id;
    document.approvedAt = new Date();

    await document.save();

    const updated = await Document.findById(document._id)
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Document approved successfully",
      document: updated,
    });
  } catch (error) {
    console.error("❌ Approve document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve document",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   8. REJECT DOCUMENT (ADMIN ONLY)
═══════════════════════════════════════════════════════════════ */
export const rejectDocument = async (req, res) => {
  try {
    const { reason } = req.body;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    document.status = "Rejected";
    document.rejectionReason = reason || "No reason provided";
    document.approvedBy = req.user._id;
    document.approvedAt = new Date();

    await document.save();

    const updated = await Document.findById(document._id)
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email");

    res.status(200).json({
      success: true,
      message: "Document rejected",
      document: updated,
    });
  } catch (error) {
    console.error("❌ Reject document error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject document",
    });
  }
};

/* ═══════════════════════════════════════════════════════════════
   9. GET ALL DOCUMENTS (ADMIN ONLY)
═══════════════════════════════════════════════════════════════ */
export const getAllDocuments = async (req, res) => {
  try {
    const { status, category, caseId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (caseId) filter.caseId = caseId;

    const documents = await Document.find(filter)
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email")
      .populate("caseId", "caseId caseTitle")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("❌ Get all documents error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};