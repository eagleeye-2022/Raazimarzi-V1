import Document from "../models/documentModel.js";
import Case from "../models/caseModel.js";
import path from "path";
import { cloudinary } from "../middleware/documentUpload.js";

/* ═══════════════════════════════════════════════════════════════
   HELPER: Check if user has access to a case
═══════════════════════════════════════════════════════════════ */
const canAccessCase = async (userId, caseId, userRole) => {
  if (userRole === "admin" || userRole === "case-manager") return true;

  const caseDoc = await Case.findById(caseId);
  if (!caseDoc) return false;

  // User is claimant (new field) or created the case (legacy)
  if (
    caseDoc.createdBy?.toString() === userId.toString() ||
    caseDoc.claimant?.toString() === userId.toString()
  ) return true;

  // User is respondent (new system)
  if (caseDoc.respondent?.userId?.toString() === userId.toString()) return true;

  // User is respondent (legacy — email match)
  const userEmail = await getUserEmail(userId);
  if (caseDoc.defendantDetails?.email === userEmail) return true;
  if (caseDoc.respondent?.email === userEmail) return true;

  // User is assigned neutral (mediator or arbitrator)
  if (caseDoc.assignedNeutral?.toString() === userId.toString()) return true;
  if (caseDoc.assignedMediator?.toString() === userId.toString()) return true;

  return false;
};

const getUserEmail = async (userId) => {
  const User = (await import("../models/userModel.js")).default;
  const user = await User.findById(userId);
  return user?.email;
};

/* ═══════════════════════════════════════════════════════════════
   HELPER: Delete file from Cloudinary
   ✅ Fixed: cloudinary.v2.uploader.destroy (v1 syntax)
═══════════════════════════════════════════════════════════════ */
const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  if (!publicId) return;
  try {
    await cloudinary.v2.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`🗑️ Cloudinary: deleted ${publicId}`);
  } catch (err) {
    console.warn(`⚠️ Cloudinary delete failed for ${publicId}:`, err.message);
  }
};

/* ═══════════════════════════════════════════════════════════════
   1. UPLOAD DOCUMENT
═══════════════════════════════════════════════════════════════ */
export const uploadDocument = async (req, res) => {
  try {
    const { documentTitle, description, category, caseId, accessControl, tags, isConfidential } = req.body;

    // ✅ Validation
    if (!documentTitle || !category || !caseId) {
      if (req.file?.filename) {
        await deleteFromCloudinary(req.file.filename, req.file.resource_type || "raw");
      }
      return res.status(400).json({
        success: false,
        message: "Document title, category, and case ID are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // ✅ Verify case exists
    const caseExists = await Case.findById(caseId);
    if (!caseExists) {
      await deleteFromCloudinary(req.file.filename, req.file.resource_type || "raw");
      return res.status(404).json({ success: false, message: "Case not found" });
    }

    // ✅ Verify user has access to the case
    const hasAccess = await canAccessCase(req.user._id, caseId, req.user.role);
    if (!hasAccess) {
      await deleteFromCloudinary(req.file.filename, req.file.resource_type || "raw");
      return res.status(403).json({ success: false, message: "You don't have access to this case" });
    }

    // ✅ Create document record
    const document = await Document.create({
      documentTitle:          documentTitle.trim(),
      description:            description?.trim(),
      category,
      originalFileName:       req.file.originalname,
      storedFileName:         req.file.filename,
      fileUrl:                req.file.path,
      cloudinaryPublicId:     req.file.filename,
      cloudinaryResourceType: req.file.resource_type || "raw",
      filePath:               "",
      fileSize:               req.file.size,
      mimeType:               req.file.mimetype,
      fileExtension:          path.extname(req.file.originalname).toLowerCase(),
      caseId,
      uploadedBy:             req.user._id,
      accessControl:          accessControl || "case-parties",
      tags:                   tags ? JSON.parse(tags) : [],
      isConfidential:         isConfidential === "true",
    });

    const populatedDoc = await Document.findById(document._id)
      .populate("uploadedBy", "name email")
      .populate("caseId", "caseId caseTitle");

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: populatedDoc,
    });
  } catch (error) {
    console.error("❌ Upload document error:", error);
    if (req.file?.filename) {
      await deleteFromCloudinary(req.file.filename, req.file.resource_type || "raw");
    }
    return res.status(500).json({
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

    const hasAccess = await canAccessCase(req.user._id, caseId, req.user.role);
    if (!hasAccess) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const documents = await Document.find({ caseId })
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 });

    const filteredDocs = documents.filter((doc) =>
      doc.canAccess(req.user._id, req.user.role)
    );

    return res.status(200).json({
      success: true,
      count: filteredDocs.length,
      documents: filteredDocs,
    });
  } catch (error) {
    console.error("❌ Get documents error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch documents" });
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
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const hasAccess     = document.canAccess(req.user._id, req.user.role);
    const hasCaseAccess = await canAccessCase(req.user._id, document.caseId._id, req.user.role);

    if (!hasAccess || !hasCaseAccess) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    await document.recordView(req.user._id, ipAddress);

    return res.status(200).json({ success: true, document });
  } catch (error) {
    console.error("❌ Get document error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch document" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   4. DOWNLOAD DOCUMENT
   ✅ Fixed: cloudinary.v2.url (v1 syntax)
═══════════════════════════════════════════════════════════════ */
export const downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    const hasAccess     = document.canAccess(req.user._id, req.user.role);
    const hasCaseAccess = await canAccessCase(req.user._id, document.caseId, req.user.role);

    if (!hasAccess || !hasCaseAccess) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await document.recordDownload();

    // ✅ Fixed: cloudinary.v2.url for v1 package
    const downloadUrl = cloudinary.v2.url(document.cloudinaryPublicId, {
      resource_type: document.cloudinaryResourceType || "raw",
      flags:         "attachment",
      secure:        true,
    });

    return res.status(200).json({
      success:     true,
      downloadUrl,
      fileName:    document.originalFileName,
    });
  } catch (error) {
    console.error("❌ Download document error:", error);
    return res.status(500).json({ success: false, message: "Failed to download document" });
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
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    if (
      req.user.role !== "admin" &&
      document.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (documentTitle)              document.documentTitle = documentTitle.trim();
    if (description !== undefined)  document.description   = description.trim();
    if (category)                   document.category      = category;
    if (tags)                       document.tags          = JSON.parse(tags);
    if (accessControl)              document.accessControl = accessControl;

    await document.save();

    const updated = await Document.findById(document._id)
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email");

    return res.status(200).json({
      success:  true,
      message:  "Document updated successfully",
      document: updated,
    });
  } catch (error) {
    console.error("❌ Update document error:", error);
    return res.status(500).json({ success: false, message: "Failed to update document" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   6. DELETE DOCUMENT
═══════════════════════════════════════════════════════════════ */
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    if (
      req.user.role !== "admin" &&
      document.uploadedBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await deleteFromCloudinary(
      document.cloudinaryPublicId,
      document.cloudinaryResourceType || "raw"
    );

    for (const version of document.previousVersions) {
      if (version.cloudinaryPublicId) {
        await deleteFromCloudinary(
          version.cloudinaryPublicId,
          version.cloudinaryResourceType || "raw"
        );
      }
    }

    await document.deleteOne();

    return res.status(200).json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("❌ Delete document error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete document" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   7. APPROVE DOCUMENT
═══════════════════════════════════════════════════════════════ */
export const approveDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    document.status     = "Approved";
    document.approvedBy = req.user._id;
    document.approvedAt = new Date();
    await document.save();

    const updated = await Document.findById(document._id)
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email");

    return res.status(200).json({
      success:  true,
      message:  "Document approved successfully",
      document: updated,
    });
  } catch (error) {
    console.error("❌ Approve document error:", error);
    return res.status(500).json({ success: false, message: "Failed to approve document" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   8. REJECT DOCUMENT
═══════════════════════════════════════════════════════════════ */
export const rejectDocument = async (req, res) => {
  try {
    const { reason } = req.body;

    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    document.status          = "Rejected";
    document.rejectionReason = reason || "No reason provided";
    document.approvedBy      = req.user._id;
    document.approvedAt      = new Date();
    await document.save();

    const updated = await Document.findById(document._id)
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email");

    return res.status(200).json({
      success:  true,
      message:  "Document rejected",
      document: updated,
    });
  } catch (error) {
    console.error("❌ Reject document error:", error);
    return res.status(500).json({ success: false, message: "Failed to reject document" });
  }
};

/* ═══════════════════════════════════════════════════════════════
   9. GET ALL DOCUMENTS (ADMIN ONLY)
═══════════════════════════════════════════════════════════════ */
export const getAllDocuments = async (req, res) => {
  try {
    const { status, category, caseId } = req.query;

    const filter = {};
    if (status)   filter.status   = status;
    if (category) filter.category = category;
    if (caseId)   filter.caseId   = caseId;

    const documents = await Document.find(filter)
      .populate("uploadedBy", "name email")
      .populate("approvedBy", "name email")
      .populate("caseId", "caseId caseTitle")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success:   true,
      count:     documents.length,
      documents,
    });
  } catch (error) {
    console.error("❌ Get all documents error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch documents" });
  }
};