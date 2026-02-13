import express from "express";
import {
  signup,
  login,
  sendPasswordResetOtp,
  verifyOtp,
  resetPassword,
  getMyProfile,
  updateProfile,
  getCurrentUser
} from "../controllers/authController.js";

// ✅ Import NEW profile functions from userController
import {
  getUserProfile,
  updateUserProfile
} from "../controllers/userController.js";

import protect from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../config/uploadConfig.js";

const router = express.Router();

/* ==================== PUBLIC ROUTES ==================== */
router.post("/signup", signup);
router.post("/login", login);

// Password reset flow
router.post("/forgot-password", sendPasswordResetOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

/* ==================== PROTECTED ROUTES ==================== */
// Your existing routes
router.get("/current-user", protect, getCurrentUser);
router.get("/my-profile", protect, getMyProfile);
router.put("/update", protect, updateProfile);

// ✅ NEW Profile routes with avatar upload
router.get("/me", protect, getUserProfile);
router.put("/profile", protect, uploadAvatar.single("avatar"), updateUserProfile);

export default router;