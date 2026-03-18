import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    // ═══════════ BASIC INFO ═══════════
    documentTitle: {
      type: String,
      required: [true, "Document title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // ═══════════ CATEGORIZATION ═══════════
    category: {
      type: String,
      required: [true, "Document category is required"],
      enum: [
        "Evidence",
        "Legal Notice",
        "Agreement",
        "Witness Statement",
        "Court Order",
        "ID Proof",
        "Address Proof",
        "Financial Document",
        "Correspondence",
        "Medical Certificate",
        "Other",
      ],
    },

    // ═══════════ FILE INFO ═══════════
    originalFileName: {
      type: String,
      required: true,
    },

    storedFileName: {
      type: String,
      required: true,
      unique: true,
    },

    // ✅ UPDATED: Cloudinary URL instead of local path
    fileUrl: {
      type: String,
      required: true,
    },

    // ✅ UPDATED: Cloudinary public_id (needed for deletion)
    cloudinaryPublicId: {
      type: String,
      required: true,
    },

    // ✅ UPDATED: Cloudinary resource type (image / raw)
    cloudinaryResourceType: {
      type: String,
      enum: ["image", "raw"],
      default: "raw",
    },

    // Kept for backward compat — local path (empty for new uploads)
    filePath: {
      type: String,
      default: "",
    },

    fileSize: {
      type: Number, // in bytes
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileExtension: {
      type: String,
      required: true,
    },

    // ═══════════ CASE ASSOCIATION ═══════════
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Case",
      required: [true, "Document must be associated with a case"],
      index: true,
    },

    // ═══════════ OWNERSHIP & ACCESS ═══════════
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    accessControl: {
      type: String,
      enum: ["private", "case-parties", "public", "admin-only"],
      default: "case-parties",
    },

    // ═══════════ VERSION CONTROL ═══════════
    version: {
      type: Number,
      default: 1,
    },

    previousVersions: [
      {
        versionNumber:          Number,
        storedFileName:         String,
        fileUrl:                String,   // Cloudinary URL
        cloudinaryPublicId:     String,   // for deletion
        cloudinaryResourceType: String,
        filePath:               String,   // legacy local path
        uploadedAt:             Date,
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    // ═══════════ STATUS & APPROVAL ═══════════
    status: {
      type: String,
      enum: ["Pending Review", "Approved", "Rejected", "Flagged"],
      default: "Pending Review",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: { type: Date },

    rejectionReason: { type: String },

    // ═══════════ METADATA ═══════════
    tags: [String],

    isConfidential: {
      type: Boolean,
      default: false,
    },

    expiresAt: { type: Date },

    downloadCount: {
      type: Number,
      default: 0,
    },

    // ═══════════ AUDIT TRAIL ═══════════
    viewHistory: [
      {
        viewedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        viewedAt: { type: Date, default: Date.now },
        ipAddress: String,
      },
    ],
  },
  { timestamps: true }
);

// ═══════════ INDEXES ═══════════
documentSchema.index({ caseId: 1, uploadedBy: 1 });
documentSchema.index({ category: 1, status: 1 });
documentSchema.index({ createdAt: -1 });

// ═══════════ METHODS ═══════════

documentSchema.methods.canAccess = function (userId, userRole) {
  if (userRole === "admin") return true;
  if (this.uploadedBy.toString() === userId.toString()) return true;
  if (this.accessControl === "public") return true;
  if (this.accessControl === "admin-only") return false;
  if (this.accessControl === "private") return false;
  return this.accessControl === "case-parties";
};

documentSchema.methods.recordDownload = async function () {
  this.downloadCount += 1;
  await this.save();
};

documentSchema.methods.recordView = async function (userId, ipAddress) {
  this.viewHistory.push({
    viewedBy:  userId,
    viewedAt:  new Date(),
    ipAddress,
  });
  if (this.viewHistory.length > 50) {
    this.viewHistory = this.viewHistory.slice(-50);
  }
  await this.save();
};

export default mongoose.model("Document", documentSchema);