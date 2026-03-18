// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//   {
//     /* ── Who paid ── */
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     /* ── What it's for ── */
//     // caseId is null BEFORE case is filed (payment happens first)
//     // caseId is set AFTER case is filed successfully
//     caseId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Case",
//       default: null,
//       index: true,
//     },

//     /* ── Payment type ── */
//     paymentType: {
//       type: String,
//       enum: ["filing-fee", "mediator-fee", "arbitrator-fee", "other"],
//       default: "filing-fee",
//     },

//     /* ── Case type (needed to know fee amount before case exists) ── */
//     caseType: {
//       type: String,
//       enum: ["property", "rental", "consumer"],
//       required: true,
//     },

//     /* ── Amount ── */
//     amount: {
//       type: Number,
//       required: true, // in paise (Razorpay uses paise — ₹500 = 50000 paise)
//     },

//     amountInRupees: {
//       type: Number,
//       required: true, // human readable
//     },

//     currency: {
//       type: String,
//       default: "INR",
//     },

//     /* ── Razorpay IDs ── */
//     razorpayOrderId: {
//       type: String,
//       required: true,
//       unique: true,
//       index: true,
//     },

//     razorpayPaymentId: {
//       type: String,
//       default: null,
//       index: true,
//     },

//     razorpaySignature: {
//       type: String,
//       default: null,
//     },

//     /* ── Status ── */
//     status: {
//       type: String,
//       enum: ["created", "paid", "failed", "refunded"],
//       default: "created",
//       index: true,
//     },

//     /* ── Receipt ── */
//     receipt: {
//       type: String, // e.g. "receipt_PR_1234567890"
//       required: true,
//     },

//     /* ── Failure reason (if failed) ── */
//     failureReason: {
//       type: String,
//       default: "",
//     },

//     /* ── Refund details ── */
//     refundId:     { type: String, default: null },
//     refundedAt:   { type: Date,   default: null },
//     refundReason: { type: String, default: "" },

//     /* ── Expiry: order expires in 15 minutes if not paid ── */
//     expiresAt: {
//       type: Date,
//       default: () => new Date(Date.now() + 15 * 60 * 1000),
//     },
//   },
//   { timestamps: true }
// );

// /* ── Indexes ── */
// paymentSchema.index({ userId: 1, status: 1 });
// paymentSchema.index({ caseType: 1, status: 1 });
// paymentSchema.index({ createdAt: -1 });

// export default mongoose.model("Payment", paymentSchema);