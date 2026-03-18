// import express from "express";
// import protect, { authorizeRoles } from "../middleware/authMiddleware.js";
// import {
//   getFilingFee,
//   createOrder,
//   verifyPayment,
//   handleWebhook,
//   linkPaymentToCase,
//   getMyPayments,
//   getPaymentStatus,
//   getAllPayments,
//   refundPayment,
// } from "../controllers/paymentController.js";

// const router = express.Router();

// const adminOnly = [protect, authorizeRoles(["admin"])];

// /* ─── Public (no auth needed for webhook — Razorpay calls this) ─── */
// router.post("/webhook", handleWebhook);

// /* ─── User routes ─── */
// router.get("/fee/:caseType",          protect, getFilingFee);        // GET /api/payments/fee/property
// router.post("/create-order",          protect, createOrder);          // POST /api/payments/create-order
// router.post("/verify",                protect, verifyPayment);        // POST /api/payments/verify
// router.post("/link-case",             protect, linkPaymentToCase);    // POST /api/payments/link-case
// router.get("/my",                     protect, getMyPayments);        // GET  /api/payments/my
// router.get("/status/:orderId",        protect, getPaymentStatus);     // GET  /api/payments/status/:orderId

// /* ─── Admin routes ─── */
// router.get("/all",                    ...adminOnly, getAllPayments);   // GET  /api/payments/all
// router.post("/:id/refund",            ...adminOnly, refundPayment);   // POST /api/payments/:id/refund

// export default router;