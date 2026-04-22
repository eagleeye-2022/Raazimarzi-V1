import Case                              from "../models/caseModel.js";
import { generateAwardPDF, generateSettlementPDF } from "../services/pdf.service.js";

/* ════════════════════════════════════════════════════════════
   GENERATE AWARD PDF
   GET /api/pdf/award/:caseId
   Access: arbitrator assigned to case + admin
════════════════════════════════════════════════════════════ */
export const downloadAwardPDF = async (req, res) => {
  try {
    const { caseId } = req.params;
    const userId     = req.user.id;
    const userRole   = req.user.role;

    /* ── Find case ── */
    const caseData = await Case.findById(caseId)
      .populate("claimant",            "name email")
      .populate("createdBy",           "name email")
      .populate("respondent.userId",   "name email")
      .populate("assignedNeutral",     "name email role")
      .populate("assignedCaseManager", "name email")
      .populate("assignedMediator",    "name email")
      .populate("reviewedBy",          "name email");

    if (!caseData)
      return res.status(404).json({ success: false, message: "Case not found" });

    /* ── Access check: admin or assigned neutral ── */
    const isAdmin    = userRole === "admin";
    const isNeutral  = caseData.assignedNeutral?._id?.toString() === userId;
    const isMediator = caseData.assignedMediator?._id?.toString() === userId;

    if (!isAdmin && !isNeutral && !isMediator)
      return res.status(403).json({ success: false, message: "Only the assigned arbitrator/mediator or admin can generate the award PDF" });

    /* ── Case must be awarded or resolved ── */
    const validStatuses = ["awarded","resolved","Resolved","Closed","closed"];
    if (!validStatuses.includes(caseData.status))
      return res.status(400).json({
        success: false,
        message: `Award PDF can only be generated for resolved/awarded cases. Current status: ${caseData.status}`,
      });

    /* ── Generate PDF ── */
    console.log(`📄 Generating award PDF for case ${caseData.caseId} by ${req.user.name}`);

    const pdfBuffer = caseData.awardType === "settlement"
      ? await generateSettlementPDF(caseData, req.user)
      : await generateAwardPDF(caseData, req.user);

    /* ── Set response headers for download ── */
    const fileName = `RaaziMarzi_Award_${caseData.caseId}_${Date.now()}.pdf`;

    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length",      pdfBuffer.length);

    /* ── Update case with award document flag ── */
    await Case.findByIdAndUpdate(caseId, {
      awardDocumentUrl: `generated:${fileName}`, // mark as generated
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ downloadAwardPDF error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate PDF", error: error.message });
  }
};

/* ════════════════════════════════════════════════════════════
   PREVIEW AWARD PDF (inline — opens in browser)
   GET /api/pdf/award/:caseId/preview
════════════════════════════════════════════════════════════ */
export const previewAwardPDF = async (req, res) => {
  try {
    const { caseId } = req.params;
    const userId     = req.user.id;
    const userRole   = req.user.role;

    const caseData = await Case.findById(caseId)
      .populate("claimant",            "name email")
      .populate("createdBy",           "name email")
      .populate("respondent.userId",   "name email")
      .populate("assignedNeutral",     "name email role")
      .populate("assignedCaseManager", "name email")
      .populate("assignedMediator",    "name email")
      .populate("reviewedBy",          "name email");

    if (!caseData)
      return res.status(404).json({ success: false, message: "Case not found" });

    const isAdmin    = userRole === "admin";
    const isNeutral  = caseData.assignedNeutral?._id?.toString() === userId;
    const isMediator = caseData.assignedMediator?._id?.toString() === userId;

    if (!isAdmin && !isNeutral && !isMediator)
      return res.status(403).json({ success: false, message: "Access denied" });

    const validStatuses = ["awarded","resolved","Resolved","Closed","closed"];
    if (!validStatuses.includes(caseData.status))
      return res.status(400).json({ success: false, message: `Case status is ${caseData.status} — must be awarded/resolved` });

    const pdfBuffer = await generateAwardPDF(caseData, req.user);
    const fileName  = `RaaziMarzi_Award_${caseData.caseId}.pdf`;

    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${fileName}"`); // inline = open in browser
    res.setHeader("Content-Length",      pdfBuffer.length);

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("❌ previewAwardPDF error:", error);
    return res.status(500).json({ success: false, message: "Failed to generate PDF preview" });
  }
};

/* ════════════════════════════════════════════════════════════
   VERIFY AWARD (public — for QR code scan)
   GET /api/pdf/verify/:awardRef
════════════════════════════════════════════════════════════ */
export const verifyAward = async (req, res) => {
  try {
    const { awardRef } = req.params;

    /* ── Extract caseId from awardRef (RMZ-AWD-2026-XXXX-CASEID) ── */
    const parts     = awardRef.split("-");
    const caseIdRef = parts[parts.length - 1]; // last segment

    const caseData = await Case.findOne({
      $or: [
        { caseId: { $regex: caseIdRef, $options: "i" } },
        { awardDocumentUrl: { $regex: awardRef, $options: "i" } },
      ],
      status: { $in: ["awarded","resolved","Resolved","Closed","closed"] },
    }).select("caseId caseTitle status awardType resolvedAt petitionerDetails defendantDetails");

    if (!caseData)
      return res.status(404).json({ success: false, message: "Award not found or invalid reference" });

    return res.status(200).json({
      success:  true,
      verified: true,
      award: {
        awardRef,
        caseId:    caseData.caseId,
        caseTitle: caseData.caseTitle,
        status:    caseData.status,
        awardType: caseData.awardType,
        issuedOn:  caseData.resolvedAt,
        claimant:  caseData.petitionerDetails?.fullName || "N/A",
        respondent:caseData.defendantDetails?.fullName  || "N/A",
        platform:  "RaaziMarzi Online Dispute Resolution",
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};