import Otp from "../models/otpModel.js";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

/* ================= SEND OTP ================= */
export const sendOtp = async (req, res) => {
  try {
    const { email, type } = req.body;

    if (!email || !type) {
      return res.status(400).json({ message: "Email and type are required" });
    }

    if (!["signup", "forgot-password"].includes(type)) {
      return res.status(400).json({ message: "Invalid OTP type" });
    }

    const user = await User.findOne({ email });

    if (type === "signup" && user) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (type === "forgot-password" && !user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({ email, type });

    await Otp.create({
      email,
      otpHash,
      type,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.in",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"RaaziMarzi App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `<h2>${otp}</h2><p>Valid for 5 minutes</p>`,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp, type } = req.body;

    if (!email || !otp || !type) {
      return res.status(400).json({ message: "Email, OTP and type required" });
    }

    const record = await Otp.findOne({ email, type }).sort({ createdAt: -1 });
    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ email, type });
      return res.status(400).json({ message: "OTP expired" });
    }

    const isMatch = await bcrypt.compare(otp.toString(), record.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await Otp.deleteMany({ email, type });

    if (type === "forgot-password") {
      await User.findOneAndUpdate(
        { email },
        { passwordResetAllowed: true }
      );

      return res.json({
        success: true,
        message: "OTP verified. You may reset password.",
      });
    }

    return res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
