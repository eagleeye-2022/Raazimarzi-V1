import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* 🔐 JWT */
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

/* =========================
   REGISTER
========================= */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      role,
      verified: true,
    });

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.passwordResetAllowed) {
      return res.status(403).json({
        message: "Password reset in progress. Please reset password.",
      });
    }

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   FORGOT PASSWORD (SEND OTP)
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.passwordResetOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.passwordResetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    user.passwordResetAllowed = false;

    await user.save();

    // 👉 SEND OTP HERE (Email / SMS)
    console.log("OTP:", otp);

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   VERIFY OTP
========================= */
export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const user = await User.findOne({
      email,
      passwordResetOTP: hashedOTP,
      passwordResetOTPExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.passwordResetAllowed = true;
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpiry = undefined;

    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.passwordResetAllowed) {
      return res.status(403).json({
        message: "OTP verification required",
      });
    }

    user.password = newPassword;
    user.passwordResetAllowed = false;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================
   GET CURRENT USER PROFILE
========================= */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Build full avatar URL if avatar exists
    let avatarUrl = "";
    if (user.avatar) {
      // Get the base URL from environment or request
      const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
      avatarUrl = `${baseUrl}/uploads/avatars/${user.avatar}`;
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: avatarUrl, // Full URL to image
      dob: user.dob,
      gender: user.gender,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      pincode: user.pincode,
      role: user.role,
      profileCompleted: user.profileCompleted,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE USER PROFILE
========================= */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Delete old avatar if new one is uploaded
    if (req.file && user.avatar) {
      const oldAvatarPath = path.join(__dirname, '../uploads/avatars', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.dob = req.body.dob || user.dob;
    user.gender = req.body.gender || user.gender;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.state = req.body.state || user.state;
    user.country = req.body.country || user.country;
    user.pincode = req.body.pincode || user.pincode;

    // ✅ Update avatar filename if new image was uploaded
    if (req.file) {
      user.avatar = req.file.filename;
    }

    // Check if profile is completed
    const requiredFields = ['name', 'email', 'phone', 'dob', 'gender', 'city', 'state', 'country'];
    const isComplete = requiredFields.every(field => user[field]);
    user.profileCompleted = isComplete;

    const updatedUser = await user.save();

    // ✅ Build full avatar URL for response
    let avatarUrl = "";
    if (updatedUser.avatar) {
      const baseUrl = process.env.API_URL || `${req.protocol}://${req.get('host')}`;
      avatarUrl = `${baseUrl}/uploads/avatars/${updatedUser.avatar}`;
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: avatarUrl,
        dob: updatedUser.dob,
        gender: updatedUser.gender,
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        country: updatedUser.country,
        pincode: updatedUser.pincode,
        role: updatedUser.role,
        profileCompleted: updatedUser.profileCompleted,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};