import mongoose from "mongoose";

/* ── Timeline entry (audit log per case) ── */
const timelineSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },   // e.g. "Case Assigned", "Status Updated"
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    note: { type: String },                      // optional free-text note
  },
  { timestamps: true }
);

/* ── Document/evidence entry ── */
const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },   // S3 / cloudinary / local path
    fileType: { type: String },                  // pdf, image, docx …
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

/* ── Main Case Schema ── */
const caseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    caseType: { type: String },
    caseTitle: { type: String, required: true },
    causeOfAction: { type: String },
    reliefSought: { type: String },
    caseValue: { type: String },

    /* ── Petitioner ── */
    petitionerDetails: {
      fullName: String,
      fatherName: String,
      gender: String,
      dob: String,
      mobile: String,
      email: String,
      address: String,
      idType: String,
      idProof: String,
    },

    /* ── Defendant ── */
    defendantDetails: {
      fullName: String,
      fatherName: String,
      gender: String,
      dob: String,
      mobile: String,
      email: String,
      idDetails: String,
    },

    /* ── Case Facts ── */
    caseFacts: {
      caseSummary: String,
      documentTitle: String,
      documentType: String,
      witnessDetails: String,
      place: String,
      date: String,
      digitalSignature: String,
      declaration: { type: Boolean, default: false },
    },

    /* ── Status ── */
    status: {
      type: String,
      enum: [
        "Pending",       // just filed, no one assigned
        "In Review",     // case manager reviewing
        "Assigned",      // mediator assigned, active
        "Hearing",       // hearing scheduled / in progress
        "Resolved",      // settled or awarded
        "Rejected",      // invalid / withdrawn
        "Closed",        // archived
      ],
      default: "Pending",
      index: true,
    },

    /* ── Assignment ── */
    assignedCaseManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    assignedMediator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    assignedAt: { type: Date, default: null },

    /* ── Hearing ── */
    hearingDate: { type: Date, default: null },
    hearingLink: { type: String, default: "" },   // video call URL
    hearingNotes: { type: String, default: "" },

    /* ── Resolution ── */
    resolutionSummary: { type: String, default: "" },
    awardDocumentUrl: { type: String, default: "" },  // final PDF
    resolvedAt: { type: Date, default: null },

    /* ── Priority ── */
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
    },

    /* ── Documents / Evidence ── */
    documents: [documentSchema],

    /* ── Timeline / Audit log ── */
    timeline: [timelineSchema],

    /* ── Owner ── */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Case", caseSchema);