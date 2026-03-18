// import Razorpay from "razorpay";
// import crypto from "crypto";
// import Payment from "../models/paymentModel.js";
// import Case from "../models/caseModel.js";

// /* ── Razorpay instance ── */
// const razorpay = new Razorpay({
//   key_id:     process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// /* ── Filing fee map (in rupees) ── */
// const FILING_FEES = {
//   property: Number(process.env.FILING_FEE_PROPERTY) || 500,
//   rental:   Number(process.env.FILING_FEE_RENTAL)   || 300,
//   consumer: Number(process.env.FILING_FEE_CONSUMER)  || 200,
// };

// /* ═══════════════════════════════════════════════════════════════
//    1. GET FILING FEE
//    Frontend calls this first to show the fee before payment
// ═══════════════════════════════════════════════════════════════ */
// export const getFilingFee = async (req, res) => {
//   try {
//     const { caseType } = req.params;

//     if (!FILING_FEES[caseType]) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid case type. Must be property, rental, or consumer",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       caseType,
//       fee: {
//         amount:        FILING_FEES[caseType],
//         amountInPaise: FILING_FEES[caseType] * 100,
//         currency:      "INR",
//         display:       `₹${FILING_FEES[caseType]}`,
//       },
//     });
//   } catch (error) {
//     console.error("❌ getFilingFee error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* ═══════════════════════════════════════════════════════════════
//    2. CREATE RAZORPAY ORDER
//    Called BEFORE case is filed
//    Flow: User selects case type → clicks Pay → this creates order
//          → frontend opens Razorpay checkout → user pays
//          → verifyPayment is called → case filing is unlocked
// ═══════════════════════════════════════════════════════════════ */
// export const createOrder = async (req, res) => {
//   try {
//     const { caseType } = req.body;

//     if (!caseType || !FILING_FEES[caseType]) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid case type. Must be property, rental, or consumer",
//       });
//     }

//     const amountInRupees = FILING_FEES[caseType];
//     const amountInPaise  = amountInRupees * 100; // Razorpay uses paise

//     const receipt = `rcpt_${caseType.toUpperCase()}_${Date.now()}`;

//     /* ── Create Razorpay order ── */
//     const order = await razorpay.orders.create({
//       amount:   amountInPaise,
//       currency: "INR",
//       receipt,
//       notes: {
//         userId:   req.user.id,
//         caseType,
//         purpose:  "Filing Fee",
//       },
//     });

//     /* ── Save payment record ── */
//     const payment = await Payment.create({
//       userId:          req.user.id,
//       caseType,
//       paymentType:     "filing-fee",
//       amount:          amountInPaise,
//       amountInRupees,
//       currency:        "INR",
//       razorpayOrderId: order.id,
//       receipt,
//       status:          "created",
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Order created successfully",
//       order: {
//         orderId:    order.id,
//         amount:     amountInPaise,
//         currency:   "INR",
//         receipt,
//         keyId:      process.env.RAZORPAY_KEY_ID, // frontend needs this for checkout
//       },
//       payment: {
//         _id:           payment._id,
//         amountInRupees,
//         caseType,
//         expiresAt:     payment.expiresAt,
//       },
//     });
//   } catch (error) {
//     console.error("❌ createOrder error:", error);
//     return res.status(500).json({ success: false, message: "Failed to create payment order", error: error.message });
//   }
// };

// /* ═══════════════════════════════════════════════════════════════
//    3. VERIFY PAYMENT
//    Called AFTER Razorpay checkout succeeds
//    Verifies signature → marks payment as paid → unlocks case filing
// ═══════════════════════════════════════════════════════════════ */
// export const verifyPayment = async (req, res) => {
//   try {
//     const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

//     if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
//       return res.status(400).json({
//         success: false,
//         message: "razorpayOrderId, razorpayPaymentId and razorpaySignature are required",
//       });
//     }

//     /* ── Step 1: Verify signature ── */
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(`${razorpayOrderId}|${razorpayPaymentId}`)
//       .digest("hex");

//     if (expectedSignature !== razorpaySignature) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment verification failed — invalid signature",
//       });
//     }

//     /* ── Step 2: Find payment record ── */
//     const payment = await Payment.findOne({ razorpayOrderId });
//     if (!payment) {
//       return res.status(404).json({ success: false, message: "Payment record not found" });
//     }

//     if (payment.status === "paid") {
//       return res.status(200).json({
//         success: true,
//         message: "Payment already verified",
//         payment,
//       });
//     }

//     /* ── Step 3: Check expiry ── */
//     if (new Date() > payment.expiresAt) {
//       payment.status        = "failed";
//       payment.failureReason = "Order expired";
//       await payment.save();
//       return res.status(400).json({ success: false, message: "Payment order has expired. Please create a new order." });
//     }

//     /* ── Step 4: Mark as paid ── */
//     payment.status             = "paid";
//     payment.razorpayPaymentId  = razorpayPaymentId;
//     payment.razorpaySignature  = razorpaySignature;
//     await payment.save();

//     return res.status(200).json({
//       success: true,
//       message: "Payment verified successfully. You can now file your case.",
//       payment: {
//         _id:           payment._id,
//         razorpayOrderId,
//         razorpayPaymentId,
//         amountInRupees: payment.amountInRupees,
//         caseType:      payment.caseType,
//         status:        "paid",
//       },
//     });
//   } catch (error) {
//     console.error("❌ verifyPayment error:", error);
//     return res.status(500).json({ success: false, message: "Payment verification failed", error: error.message });
//   }
// };

// /* ═══════════════════════════════════════════════════════════════
//    4. RAZORPAY WEBHOOK
//    Razorpay calls this automatically for payment events
//    Set this URL in Razorpay Dashboard → Webhooks
//    URL: https://yourdomain.com/api/payments/webhook
// ═══════════════════════════════════════════════════════════════ */
// export const handleWebhook = async (req, res) => {
//   try {
//     const webhookSecret    = process.env.RAZORPAY_WEBHOOK_SECRET;
//     const webhookSignature = req.headers["x-razorpay-signature"];

//     /* ── Verify webhook signature ── */
//     if (webhookSecret) {
//       const expectedSignature = crypto
//         .createHmac("sha256", webhookSecret)
//         .update(JSON.stringify(req.body))
//         .digest("hex");

//       if (expectedSignature !== webhookSignature) {
//         console.warn("⚠️ Webhook signature mismatch");
//         return res.status(400).json({ message: "Invalid webhook signature" });
//       }
//     }

//     const event   = req.body.event;
//     const payload = req.body.payload;

//     console.log(`📦 Razorpay Webhook: ${event}`);

//     switch (event) {

//       /* ── Payment captured (success) ── */
//       case "payment.captured": {
//         const razorpayPaymentId = payload.payment.entity.id;
//         const razorpayOrderId   = payload.payment.entity.order_id;

//         const payment = await Payment.findOne({ razorpayOrderId });
//         if (payment && payment.status !== "paid") {
//           payment.status            = "paid";
//           payment.razorpayPaymentId = razorpayPaymentId;
//           await payment.save();

//           // If payment is linked to a case, mark case as paid
//           if (payment.caseId) {
//             await Case.findByIdAndUpdate(payment.caseId, { filingFeePaid: true });
//           }
//           console.log(`✅ Webhook: Payment captured for order ${razorpayOrderId}`);
//         }
//         break;
//       }

//       /* ── Payment failed ── */
//       case "payment.failed": {
//         const razorpayOrderId = payload.payment.entity.order_id;
//         const errorDesc       = payload.payment.entity.error_description || "Payment failed";

//         const payment = await Payment.findOne({ razorpayOrderId });
//         if (payment && payment.status === "created") {
//           payment.status        = "failed";
//           payment.failureReason = errorDesc;
//           await payment.save();
//           console.log(`❌ Webhook: Payment failed for order ${razorpayOrderId}`);
//         }
//         break;
//       }

//       /* ── Refund processed ── */
//       case "refund.processed": {
//         const razorpayPaymentId = payload.refund.entity.payment_id;
//         const refundId          = payload.refund.entity.id;

//         const payment = await Payment.findOne({ razorpayPaymentId });
//         if (payment) {
//           payment.status    = "refunded";
//           payment.refundId  = refundId;
//           payment.refundedAt = new Date();
//           await payment.save();

//           // Remove filing fee paid from case
//           if (payment.caseId) {
//             await Case.findByIdAndUpdate(payment.caseId, { filingFeePaid: false });
//           }
//           console.log(`💸 Webhook: Refund processed for payment ${razorpayPaymentId}`);
//         }
//         break;
//       }

//       default:
//         console.log(`ℹ️ Webhook: Unhandled event ${event}`);
//     }

//     /* ── Always return 200 to Razorpay ── */
//     return res.status(200).json({ received: true });
//   } catch (error) {
//     console.error("❌ Webhook error:", error);
//     return res.status(500).json({ message: error.message });
//   }
// };

// /* ═══════════════════════════════════════════════════════════════
//    5. LINK PAYMENT TO CASE
//    Called after case is filed successfully
//    Updates payment record with the new caseId
//    Also updates case with filingFeePaid: true
// ═══════════════════════════════════════════════════════════════ */
// export const linkPaymentToCase = async (req, res) => {
//   try {
//     const { razorpayOrderId, caseId } = req.body;

//     if (!razorpayOrderId || !caseId) {
//       return res.status(400).json({
//         success: false,
//         message: "razorpayOrderId and caseId are required",
//       });
//     }

//     const payment = await Payment.findOne({
//       razorpayOrderId,
//       userId: req.user.id,
//       status: "paid",
//     });

//     if (!payment) {
//       return res.status(404).json({
//         success: false,
//         message: "Paid payment not found for this order",
//       });
//     }

//     if (payment.caseId) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment already linked to a case",
//       });
//     }

//     /* ── Link payment to case ── */
//     payment.caseId = caseId;
//     await payment.save();

//     /* ── Mark case as filing fee paid ── */
//     await Case.findByIdAndUpdate(caseId, {
//       filingFeePaid: true,
//       filingFee:     payment.amountInRupees,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Payment linked to case successfully",
//       payment,
//     });
//   } catch (error) {
//     console.error("❌ linkPaymentToCase error:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* ═══════════════════════════════════════════════════════════════
//    6. GET MY PAYMENTS
//    User can see their own payment history
// ═══════════════════════════════════════════════════════════════ */
// export const getMyPayments = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;

//     const total    = await Payment.countDocuments({ userId: req.user.id });
//     const payments = await Payment.find({ userId: req.user.id })
//       .populate("caseId", "caseId caseTitle status")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     return res.status(200).json({ success: true, total, payments });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* ═══════════════════════════════════════════════════════════════
//    7. GET PAYMENT STATUS
//    Check if a specific order has been paid
//    Frontend polls this after checkout
// ═══════════════════════════════════════════════════════════════ */
// export const getPaymentStatus = async (req, res) => {
//   try {
//     const payment = await Payment.findOne({
//       razorpayOrderId: req.params.orderId,
//       userId:          req.user.id,
//     }).populate("caseId", "caseId caseTitle");

//     if (!payment) {
//       return res.status(404).json({ success: false, message: "Payment not found" });
//     }

//     return res.status(200).json({
//       success: true,
//       payment: {
//         _id:              payment._id,
//         status:           payment.status,
//         amountInRupees:   payment.amountInRupees,
//         caseType:         payment.caseType,
//         razorpayOrderId:  payment.razorpayOrderId,
//         razorpayPaymentId: payment.razorpayPaymentId,
//         caseId:           payment.caseId,
//         createdAt:        payment.createdAt,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* ═══════════════════════════════════════════════════════════════
//    8. GET ALL PAYMENTS — ADMIN
// ═══════════════════════════════════════════════════════════════ */
// export const getAllPayments = async (req, res) => {
//   try {
//     const { status, caseType, page = 1, limit = 20, search } = req.query;

//     const filter = {};
//     if (status)   filter.status   = status;
//     if (caseType) filter.caseType = caseType;
//     if (search) {
//       filter.$or = [
//         { razorpayOrderId:   { $regex: search, $options: "i" } },
//         { razorpayPaymentId: { $regex: search, $options: "i" } },
//         { receipt:           { $regex: search, $options: "i" } },
//       ];
//     }

//     const total    = await Payment.countDocuments(filter);
//     const payments = await Payment.find(filter)
//       .populate("userId", "name email")
//       .populate("caseId", "caseId caseTitle status")
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(Number(limit));

//     /* ── Revenue stats ── */
//     const totalRevenue = await Payment.aggregate([
//       { $match: { status: "paid" } },
//       { $group: { _id: null, total: { $sum: "$amountInRupees" } } },
//     ]);

//     return res.status(200).json({
//       success: true,
//       total,
//       totalRevenue: totalRevenue[0]?.total || 0,
//       payments,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* ═══════════════════════════════════════════════════════════════
//    9. REFUND PAYMENT — ADMIN ONLY
// ═══════════════════════════════════════════════════════════════ */
// export const refundPayment = async (req, res) => {
//   try {
//     const { reason } = req.body;

//     const payment = await Payment.findById(req.params.id);
//     if (!payment)
//       return res.status(404).json({ success: false, message: "Payment not found" });

//     if (payment.status !== "paid")
//       return res.status(400).json({ success: false, message: "Only paid payments can be refunded" });

//     if (!payment.razorpayPaymentId)
//       return res.status(400).json({ success: false, message: "No Razorpay payment ID found" });

//     /* ── Create refund via Razorpay ── */
//     const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
//       amount: payment.amount, // full refund in paise
//       notes:  { reason: reason || "Refund by admin" },
//     });

//     payment.status       = "refunded";
//     payment.refundId     = refund.id;
//     payment.refundedAt   = new Date();
//     payment.refundReason = reason || "";
//     await payment.save();

//     /* ── Remove filing fee paid from case ── */
//     if (payment.caseId) {
//       await Case.findByIdAndUpdate(payment.caseId, { filingFeePaid: false });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Refund processed successfully",
//       refundId: refund.id,
//       payment,
//     });
//   } catch (error) {
//     console.error("❌ refundPayment error:", error);
//     return res.status(500).json({ success: false, message: "Refund failed", error: error.message });
//   }
// };