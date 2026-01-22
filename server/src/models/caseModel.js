import mongoose from "mongoose";

const caseSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    caseType: {
      type: String,
    },

    caseTitle: {
      type: String,
      required: true,
    },

    causeOfAction: {
      type: String,
    },

    reliefSought: {
      type: String,
    },

    caseValue: {
      type: String,
    },

    /* ================= PETITIONER ================= */
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

    /* ================= DEFENDANT ================= */
    defendantDetails: {
      fullName: String,
      fatherName: String,
      gender: String,
      dob: String,
      mobile: String,
      email: String,
      idDetails: String,
    },

    /* ================= CASE FACTS ================= */
    caseFacts: {
      caseSummary: String,
      documentTitle: String,
      documentType: String,
      witnessDetails: String,
      place: String,
      date: String,
      digitalSignature: String,
      declaration: {
        type: Boolean,
        default: false,
      },
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["Pending", "In Review", "Assigned", "Resolved", "Rejected"],
      default: "Pending",
    },

    /* ================= USER ================= */
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


