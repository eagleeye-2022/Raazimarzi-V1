import PDFDocument from "pdfkit";
import QRCode      from "qrcode";
import path        from "path";
import { fileURLToPath } from "url";
import crypto      from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/* ── Logo path — place raazimarzi_logo.png in src/assets/ ── */
const LOGO_PATH = path.join(__dirname, "../assets/raazimarzi_logo.png");

/* ── Brand colors ── */
const COLORS = {
  primary:    "#4F3CC9",  // RaaziMarzi purple
  secondary:  "#1D9E75",  // teal accent
  dark:       "#1a1a2e",
  gray:       "#6B7280",
  lightGray:  "#F3F4F6",
  border:     "#E5E7EB",
  white:      "#FFFFFF",
  danger:     "#DC2626",
  success:    "#16A34A",
};

/* ════════════════════════════════════════════════════════════
   HELPER: Generate unique award reference number
════════════════════════════════════════════════════════════ */
const generateAwardRef = (caseId) => {
  const year   = new Date().getFullYear();
  const random = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `RMZ-AWD-${year}-${random}-${caseId.replace(/[^A-Z0-9]/gi, "").slice(0, 6).toUpperCase()}`;
};

/* ════════════════════════════════════════════════════════════
   HELPER: Format date nicely
════════════════════════════════════════════════════════════ */
const fmtDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  });
};

/* ════════════════════════════════════════════════════════════
   HELPER: Draw horizontal line
════════════════════════════════════════════════════════════ */
const drawLine = (doc, y, color = COLORS.border, width = 1) => {
  doc.save()
     .strokeColor(color)
     .lineWidth(width)
     .moveTo(50, y)
     .lineTo(doc.page.width - 50, y)
     .stroke()
     .restore();
};

/* ════════════════════════════════════════════════════════════
   HELPER: Section header
════════════════════════════════════════════════════════════ */
const sectionHeader = (doc, title, y) => {
  doc.save()
     .rect(50, y, doc.page.width - 100, 28)
     .fill(COLORS.primary);
  doc.fillColor(COLORS.white)
     .fontSize(11)
     .font("Helvetica-Bold")
     .text(title.toUpperCase(), 60, y + 8);
  doc.restore();
  return y + 36;
};

/* ════════════════════════════════════════════════════════════
   HELPER: Two-column row
════════════════════════════════════════════════════════════ */
const twoColRow = (doc, label, value, y, labelColor = COLORS.gray) => {
  doc.fillColor(labelColor).fontSize(9).font("Helvetica-Bold")
     .text(label, 60, y, { width: 160 });
  doc.fillColor(COLORS.dark).fontSize(9).font("Helvetica")
     .text(value || "N/A", 230, y, { width: 310 });
  return y + 18;
};

/* ════════════════════════════════════════════════════════════
   MAIN: GENERATE AWARD PDF
   Returns a Buffer containing the PDF bytes
════════════════════════════════════════════════════════════ */
export const generateAwardPDF = async (caseData, generatedBy) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc    = new PDFDocument({ size: "A4", margin: 50, bufferPages: true });
      const chunks = [];

      doc.on("data",  chunk => chunks.push(chunk));
      doc.on("end",   ()    => resolve(Buffer.concat(chunks)));
      doc.on("error", err   => reject(err));

      const awardRef    = generateAwardRef(caseData.caseId);
      const issuedDate  = new Date();
      const pageWidth   = doc.page.width;
      const contentW    = pageWidth - 100;

      /* ── Generate QR code ── */
      const verifyUrl = `${process.env.FRONTEND_URL}/verify-award/${awardRef}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, { width: 120, margin: 1 });
      const qrBuffer  = Buffer.from(qrDataUrl.split(",")[1], "base64");

      /* ══════════════════════════════════════
         PAGE 1
      ══════════════════════════════════════ */

      /* ── Header background ── */
      doc.rect(0, 0, pageWidth, 110).fill(COLORS.primary);

      /* ── Logo ── */
      try {
        doc.image(LOGO_PATH, 50, 18, { height: 50 });
      } catch {
        /* logo not found — show text instead */
        doc.fillColor(COLORS.white).fontSize(20).font("Helvetica-Bold")
           .text("RaaziMarzi", 50, 35);
      }

      /* ── Header right text ── */
      doc.fillColor(COLORS.white)
         .fontSize(8).font("Helvetica")
         .text("Online Dispute Resolution Platform", pageWidth - 250, 28, { width: 200, align: "right" })
         .text("www.raazimarzi.com", pageWidth - 250, 42, { width: 200, align: "right" });

      /* ── Award title ── */
      doc.fillColor(COLORS.white)
         .fontSize(22).font("Helvetica-Bold")
         .text("ARBITRATION AWARD", 0, 72, { align: "center" });

      /* ── Award reference badge ── */
      doc.rect(0, 118, pageWidth, 30).fill(COLORS.secondary);
      doc.fillColor(COLORS.white).fontSize(9).font("Helvetica")
         .text(`Award Reference: ${awardRef}`, 0, 126, { align: "center" });

      let y = 162;

      /* ── Award type badge ── */
      const awardTypeLabel = {
        "arbitration-award": "ARBITRATION AWARD",
        "ex-parte-award":    "EX-PARTE AWARD",
        "settlement":        "SETTLEMENT AGREEMENT",
        "court-referral":    "COURT REFERRAL ORDER",
      }[caseData.awardType] || "ARBITRATION AWARD";

      const badgeColor = caseData.isExParte ? COLORS.danger : COLORS.primary;
      doc.roundedRect(50, y, 200, 24, 4).fill(badgeColor);
      doc.fillColor(COLORS.white).fontSize(9).font("Helvetica-Bold")
         .text(awardTypeLabel, 55, y + 7, { width: 190 });

      /* ── Issued date (top right) ── */
      doc.fillColor(COLORS.gray).fontSize(9).font("Helvetica")
         .text(`Issued: ${fmtDate(issuedDate)}`, pageWidth - 230, y + 7, { width: 180, align: "right" });

      y += 40;

      /* ── SECTION 1: CASE DETAILS ── */
      y = sectionHeader(doc, "Case Details", y);

      y = twoColRow(doc, "Case ID",          caseData.caseId,    y);
      y = twoColRow(doc, "Case Title",       caseData.caseTitle, y);
      y = twoColRow(doc, "Case Type",        (caseData.caseType || "").toUpperCase(), y);
      y = twoColRow(doc, "Case Value",       caseData.caseValue ? `₹${caseData.caseValue}` : "N/A", y);
      y = twoColRow(doc, "Filed On",         fmtDate(caseData.createdAt), y);
      y = twoColRow(doc, "Status",           caseData.status?.toUpperCase(), y);
      y = twoColRow(doc, "Jurisdiction",     caseData.jurisdiction || "India (IN)", y);
      y = twoColRow(doc, "Relief Sought",    caseData.reliefSought || "N/A", y);
      if (caseData.isExParte) {
        y = twoColRow(doc, "Proceeding Type", "EX-PARTE (Respondent did not appear)", y, COLORS.danger);
      }
      y += 8;

      /* ── SECTION 2: PARTIES ── */
      y = sectionHeader(doc, "Parties to the Dispute", y);

      /* Claimant */
      doc.fillColor(COLORS.primary).fontSize(10).font("Helvetica-Bold")
         .text("CLAIMANT (Petitioner)", 60, y);
      y += 16;

      const pet = caseData.petitionerDetails || {};
      y = twoColRow(doc, "Full Name",   pet.fullName   || caseData.claimant?.name || "N/A", y);
      y = twoColRow(doc, "Email",       pet.email      || caseData.claimant?.email || "N/A", y);
      y = twoColRow(doc, "Mobile",      pet.mobile     || "N/A", y);
      y = twoColRow(doc, "Address",     pet.address    || "N/A", y);
      y = twoColRow(doc, "ID Proof",    pet.idType ? `${pet.idType}: ${pet.idProof}` : "N/A", y);
      y += 8;

      /* Respondent */
      doc.fillColor(COLORS.danger).fontSize(10).font("Helvetica-Bold")
         .text("RESPONDENT (Defendant)", 60, y);
      y += 16;

      const def = caseData.defendantDetails || {};
      y = twoColRow(doc, "Full Name",   def.fullName   || caseData.respondent?.name  || "N/A", y);
      y = twoColRow(doc, "Email",       def.email      || caseData.respondent?.email || "N/A", y);
      y = twoColRow(doc, "Mobile",      def.mobile     || caseData.respondent?.phone || "N/A", y);
      if (caseData.isExParte) {
        y = twoColRow(doc, "Appearance", "DID NOT APPEAR — Ex-Parte Proceedings", y, COLORS.danger);
      } else {
        y = twoColRow(doc, "Response Status",
          caseData.respondent?.responseSubmittedAt ? `Submitted on ${fmtDate(caseData.respondent.responseSubmittedAt)}` : "N/A", y);
      }
      y += 8;

      /* ── SECTION 3: NEUTRAL (Arbitrator/Mediator) ── */
      y = sectionHeader(doc, `${caseData.neutralType === "arbitrator" ? "Arbitrator" : "Mediator"} Details`, y);

      const neutral = caseData.assignedNeutral || {};
      y = twoColRow(doc, "Name",       neutral.name  || "N/A", y);
      y = twoColRow(doc, "Email",      neutral.email || "N/A", y);
      y = twoColRow(doc, "Role",       (caseData.neutralType || "neutral").toUpperCase(), y);
      y = twoColRow(doc, "Platform",   "RaaziMarzi Online Dispute Resolution", y);
      y += 8;

      /* ── Check if we need a new page ── */
      if (y > 650) { doc.addPage(); y = 50; }

      /* ── SECTION 4: PROCEEDINGS SUMMARY ── */
      y = sectionHeader(doc, "Summary of Proceedings", y);

      const keyDates = [
        { label: "Case Filed",           date: caseData.createdAt },
        { label: "Admin Accepted",       date: caseData.reviewedAt },
        { label: "Notice Period Start",  date: caseData.noticePeriodStartAt },
        { label: "Notice Period End",    date: caseData.noticePeriodEndAt },
        { label: "Case Manager Assigned",date: caseData.assignedAt },
        { label: "Hearing Date",         date: caseData.hearingDate },
        { label: "Award Issued",         date: issuedDate },
      ].filter(d => d.date);

      keyDates.forEach(({ label, date }) => {
        y = twoColRow(doc, label, fmtDate(date), y);
      });

      y = twoColRow(doc, "Total Notices Sent", `${caseData.noticesSent?.length || 0} notices`, y);
      y = twoColRow(doc, "Filing Fee",  caseData.filingFeePaid ? `₹${caseData.filingFee} (Paid)` : "Not paid", y);
      y += 8;

      /* ── SECTION 5: AWARD DECISION ── */
      if (y > 600) { doc.addPage(); y = 50; }
      y = sectionHeader(doc, "Award & Decision", y);

      /* Case summary / facts */
      if (caseData.caseFacts?.caseSummary) {
        doc.fillColor(COLORS.gray).fontSize(9).font("Helvetica-Bold")
           .text("CASE SUMMARY", 60, y);
        y += 14;
        doc.fillColor(COLORS.dark).fontSize(9).font("Helvetica")
           .text(caseData.caseFacts.caseSummary, 60, y, { width: contentW - 20 });
        y += doc.heightOfString(caseData.caseFacts.caseSummary, { width: contentW - 20 }) + 10;
      }

      /* Resolution / Award text */
      doc.fillColor(COLORS.gray).fontSize(9).font("Helvetica-Bold")
         .text("AWARD / RESOLUTION", 60, y);
      y += 14;

      const awardText = caseData.resolutionSummary || "Award details to be inserted by the arbitrator.";
      doc.rect(58, y, contentW + 4, doc.heightOfString(awardText, { width: contentW - 20 }) + 20)
         .fill(COLORS.lightGray);
      doc.fillColor(COLORS.dark).fontSize(10).font("Helvetica")
         .text(awardText, 68, y + 10, { width: contentW - 20 });
      y += doc.heightOfString(awardText, { width: contentW - 20 }) + 30;

      /* Relief granted */
      if (caseData.reliefSought) {
        y = twoColRow(doc, "Relief Sought",   caseData.reliefSought, y);
      }

      /* Compliance notice */
      y += 8;
      doc.rect(50, y, contentW + 0, 36).fill("#FEF3C7");
      doc.fillColor("#92400E").fontSize(9).font("Helvetica-Bold")
         .text("COMPLIANCE NOTICE", 62, y + 6);
      doc.fillColor("#78350F").fontSize(8).font("Helvetica")
         .text("Both parties are required to comply with this award within 30 days of the date of issue. Non-compliance may result in enforcement through competent civil courts.", 62, y + 18, { width: contentW - 24 });
      y += 50;

      /* ══════════════════════════════════════
         PAGE 2 — Signature + QR
      ══════════════════════════════════════ */
      if (y > 580) { doc.addPage(); y = 50; }

      /* ── SECTION 6: SIGNATURE BLOCK ── */
      y = sectionHeader(doc, "Authentication & Signatures", y);
      y += 10;

      const sigBoxW = (contentW - 20) / 3;

      /* Arbitrator signature */
      doc.rect(50, y, sigBoxW, 100).stroke(COLORS.border);
      doc.fillColor(COLORS.gray).fontSize(8).font("Helvetica")
         .text("ARBITRATOR / MEDIATOR", 55, y + 8);
      doc.fillColor(COLORS.dark).fontSize(9).font("Helvetica-Bold")
         .text(neutral.name || "N/A", 55, y + 22, { width: sigBoxW - 10 });
      doc.fillColor(COLORS.gray).fontSize(8).font("Helvetica")
         .text("Signature", 55, y + 72)
         .text("___________________", 55, y + 82);

      /* Platform seal */
      const sealX = 50 + sigBoxW + 10;
      doc.rect(sealX, y, sigBoxW, 100).stroke(COLORS.border);
      doc.fillColor(COLORS.gray).fontSize(8).font("Helvetica")
         .text("PLATFORM SEAL", sealX + 5, y + 8);
      doc.circle(sealX + sigBoxW / 2, y + 52, 32)
         .stroke(COLORS.primary);
      doc.fillColor(COLORS.primary).fontSize(7).font("Helvetica-Bold")
         .text("RAAZIMARZI", sealX + 5, y + 42, { width: sigBoxW, align: "center" })
         .text("ODR PLATFORM", sealX + 5, y + 52, { width: sigBoxW, align: "center" })
         .text("CERTIFIED", sealX + 5, y + 62, { width: sigBoxW, align: "center" });

      /* QR code */
      const qrX = sealX + sigBoxW + 10;
      doc.rect(qrX, y, sigBoxW, 100).stroke(COLORS.border);
      doc.fillColor(COLORS.gray).fontSize(8).font("Helvetica")
         .text("VERIFY AWARD", qrX + 5, y + 8);
      doc.image(qrBuffer, qrX + (sigBoxW - 70) / 2, y + 18, { width: 70, height: 70 });

      y += 115;

      /* Generated by */
      y = twoColRow(doc, "Generated By",  `${generatedBy?.name || "System"} (${generatedBy?.role || "admin"})`, y);
      y = twoColRow(doc, "Generated On",  fmtDate(issuedDate), y);
      y = twoColRow(doc, "Award Ref",     awardRef, y);
      y = twoColRow(doc, "Verify Online", verifyUrl, y);
      y += 16;

      /* ── Legal disclaimer ── */
      drawLine(doc, y);
      y += 10;
      doc.fillColor(COLORS.gray).fontSize(7.5).font("Helvetica")
         .text(
           "This award has been issued by RaaziMarzi Online Dispute Resolution Platform in accordance with the Information Technology Act, 2000 and the Arbitration and Conciliation Act, 1996 (as amended). " +
           "This document is legally binding on both parties. Any party aggrieved by this award may challenge it before the appropriate court within the statutory limitation period. " +
           "For verification of authenticity, scan the QR code or visit the verification URL above. Unauthorized modification of this document is a punishable offence.",
           50, y, { width: contentW, align: "justify" }
         );

      /* ── Page numbers ── */
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.fillColor(COLORS.gray).fontSize(8).font("Helvetica")
           .text(
             `RaaziMarzi ODR | Award Ref: ${awardRef} | Page ${i + 1} of ${totalPages}`,
             50, doc.page.height - 30,
             { width: contentW, align: "center" }
           );
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

/* ════════════════════════════════════════════════════════════
   GENERATE SETTLEMENT AGREEMENT PDF
   Same structure but for mediation settlements
════════════════════════════════════════════════════════════ */
export const generateSettlementPDF = async (caseData, generatedBy) => {
  // Uses the same generator — just the awardType label changes
  caseData.awardType = caseData.awardType || "settlement";
  return generateAwardPDF(caseData, generatedBy);
};