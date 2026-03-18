import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getUserDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

// ── User Dashboard ──
// Returns: stats, cases (filed + against me), meetings, today reminder, documents
router.get("/user", protect, getUserDashboardData);

export default router;
