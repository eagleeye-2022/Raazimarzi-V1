import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  fileNewCase,
  getUserCases,
  getAllCases,
} from "../controllers/caseController.js";

const router = express.Router();

// User
router.post("/file", protect, fileNewCase);
router.get("/my-cases", protect, getUserCases);

// Admin
router.get("/all", protect, getAllCases);

export default router;
