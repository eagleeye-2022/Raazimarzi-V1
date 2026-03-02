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
        "Evidence",                 // Photos, videos, physical evidence scans
        "Legal Notice",             // Legal notices, summons
        "Agreement",                // Settlement agreements, contracts
        "Witness Statement",        // Witness affidavits, statements
        "Court Order",              // Court decisions, orders
        "ID Proof",                 // Identity documents
        "Address Proof",            // Utility bills, rental agreements
        "Financial Document",       // Bank statements, invoices
        "Correspondence",           // Emails, letters
        "Medical Certificate",      // Medical reports, certificates
        "Other",                    // Miscellaneous
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

    filePath: {
      type: String,
      required: true,
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

    // Who can view this document
    accessControl: {
      type: String,
      enum: ["private", "case-parties", "public", "admin-only"],
      default: "case-parties",
      // private: only uploader
      // case-parties: petitioner + defendant + admin
      // public: everyone
      // admin-only: only admins
    },

    // ═══════════ VERSION CONTROL ═══════════
    version: {
      type: Number,
      default: 1,
    },

    previousVersions: [
      {
        versionNumber: Number,
        storedFileName: String,
        filePath: String,
        uploadedAt: Date,
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

    approvedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
    },

    // ═══════════ METADATA ═══════════
    tags: [String], // searchable tags

    isConfidential: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date, // Optional: auto-delete after case closure + X days
    },

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
        viewedAt: {
          type: Date,
          default: Date.now,
        },
        ipAddress: String,
      },
    ],
  },
  {
    timestamps: true, // auto createdAt, updatedAt
  }
);

// ═══════════ INDEXES ═══════════
documentSchema.index({ caseId: 1, uploadedBy: 1 });
documentSchema.index({ category: 1, status: 1 });
documentSchema.index({ createdAt: -1 });

// ═══════════ METHODS ═══════════

// Check if user has access to this document
documentSchema.methods.canAccess = function (userId, userRole) {
  // Admin can access everything
  if (userRole === "admin") return true;

  // Uploader can always access their own documents
  if (this.uploadedBy.toString() === userId.toString()) return true;

  // Check access control level
  if (this.accessControl === "public") return true;
  if (this.accessControl === "admin-only") return false;
  if (this.accessControl === "private") return false;

  // For case-parties, need to check if user is petitioner/defendant
  // This will be handled in controller with case lookup
  return this.accessControl === "case-parties";
};

// Increment download counter
documentSchema.methods.recordDownload = async function () {
  this.downloadCount += 1;
  await this.save();
};

// Record view in audit trail
documentSchema.methods.recordView = async function (userId, ipAddress) {
  this.viewHistory.push({
    viewedBy: userId,
    viewedAt: new Date(),
    ipAddress,
  });
  
  // Keep only last 50 views to prevent bloat
  if (this.viewHistory.length > 50) {
    this.viewHistory = this.viewHistory.slice(-50);
  }
  
  await this.save();
};

export default mongoose.model("Document", documentSchema);