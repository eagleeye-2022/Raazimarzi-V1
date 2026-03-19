import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    /* ── Case reference ── */
    caseId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "Case",
      required: true,
      index:    true,
    },

    /* ── Who submitted ── */
    submittedBy: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
      index:    true,
    },

    /* ── Role of submitter ── */
    submitterRole: {
      type: String,
      enum: ["claimant", "respondent", "mediator", "arbitrator"],
      required: true,
    },

    /* ── Overall rating (1-5 stars) ── */
    overallRating: {
      type:     Number,
      required: true,
      min:      1,
      max:      5,
    },

    /* ── Category ratings ── */
    ratings: {
      processRating: { type: Number, min: 1, max: 5 }, // how fair was the process
      neutralRating: { type: Number, min: 1, max: 5 }, // mediator/arbitrator quality
      platformRating:{ type: Number, min: 1, max: 5 }, // ease of using platform
      timeRating:    { type: Number, min: 1, max: 5 }, // speed of resolution
    },

    /* ── Text feedback ── */
    comment: {
      type:      String,
      trim:      true,
      maxlength: 1000,
    },

    /* ── Outcome satisfaction ── */
    satisfiedWithOutcome: {
      type: Boolean,
      default: null,
    },

    /* ── Would recommend ── */
    wouldRecommend: {
      type: Boolean,
      default: null,
    },

    /* ── Tags (quick select) ── */
    tags: [{
      type: String,
      enum: [
        "fair-process",
        "fast-resolution",
        "professional-mediator",
        "easy-to-use",
        "good-communication",
        "unfair-outcome",
        "slow-process",
        "technical-issues",
        "needs-improvement",
      ],
    }],

    /* ── Is visible to public ── */
    isPublic: {
      type:    Boolean,
      default: true,
    },

    /* ── Admin moderation ── */
    isApproved: {
      type:    Boolean,
      default: true, // auto-approved unless flagged
    },

    isFlagged: {
      type:    Boolean,
      default: false,
    },

    flagReason: {
      type:    String,
      default: "",
    },
  },
  { timestamps: true }
);

/* ── Indexes ── */
feedbackSchema.index({ caseId: 1, submittedBy: 1 }, { unique: true }); // one feedback per user per case
feedbackSchema.index({ overallRating: 1 });
feedbackSchema.index({ createdAt: -1 });

export default mongoose.model("Feedback", feedbackSchema);