import Otp from "../models/otpModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { sendOtpMail } from "../services/mail.service.js"; // new centralized mail function

/* ================= SEND OTP ================= */
export const sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({ success: false, message: "Email and type are required" });
    }

    if (!["signup", "forgot-password"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid OTP type" });
    }

    const user = await User.findOne({ email });

    if (type === "signup" && user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    if (type === "forgot-password" && !user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // Remove old OTPs
    await Otp.deleteMany({ email, type });

    // Save new OTP
    await Otp.create({
      email,
      otpHash,
      type,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
    });

    // Send OTP email using centralized mail service
    await sendOtpMail({ email, otp, type });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("❌ sendOtp error:", error);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, type } = req.body;

    if (!email || !otp || !type) {
      return res.status(400).json({ success: false, message: "Email, OTP and type required" });
    }

    const record = await Otp.findOne({ email, type }).sort({ createdAt: -1 });
    if (!record) return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email, type });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp.toString(), record.otpHash);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid OTP" });

    await Otp.deleteMany({ email, type });

    if (type === "forgot-password") {
      await User.findOneAndUpdate({ email }, { passwordResetAllowed: true });
      return res.json({ success: true, message: "OTP verified. You may reset password." });
    }

    return res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.error("❌ verifyOtp error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
