import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { sendOtpMail } from "../services/mail.service.js";

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Name, email and password are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: "User already exists with this email" 
      });
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      phone: phone || "",
      password,
      role: role || "user",
      verified: true // Auto-verify or set to false if you want OTP verification
    });

    // Generate token
    const token = generateToken(newUser);

    console.log("✅ User registered successfully:", email);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        verified: newUser.verified
      }
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ 
      message: "Error during signup",
      error: error.message 
    });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    const isPasswordMatch = await user.matchPassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    const token = generateToken(user);

    console.log("✅ User logged in successfully:", email);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verified: user.verified
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ 
      message: "Error during login",
      error: error.message 
    });
  }
};

/* ================= SEND OTP FOR PASSWORD RESET ================= */
export const sendPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // Save OTP to database (expires in 5 minutes)
    await Otp.findOneAndUpdate(
      { email },
      {
        email,
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      },
      { upsert: true, new: true }
    );

    // Send OTP via email
    await sendOtpMail({ email, otp, type: "password-reset" });

    console.log("✅ Password reset OTP sent to:", email);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email"
    });

  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ 
      message: "Error sending OTP",
      error: error.message 
    });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ 
        message: "Email and OTP are required" 
      });
    }

    // Find OTP record
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if OTP expired
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Verify OTP
    const isMatch = await bcrypt.compare(String(otp), otpRecord.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    console.log("✅ OTP verified for:", email);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully"
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ 
      message: "Error verifying OTP",
      error: error.message 
    });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        message: "Email, OTP and new password are required" 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find OTP record
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if OTP expired
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteMany({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    // Verify OTP
    const isMatch = await bcrypt.compare(String(otp), otpRecord.otpHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update user password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    // Delete OTP after successful reset
    await Otp.deleteMany({ email });

    console.log("✅ Password reset successful for:", email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ 
      message: "Error resetting password",
      error: error.message 
    });
  }
};



/* =========================
   GET CURRENT USER PROFILE
========================= */
export const getMyProfile = async (req, res) => {
  try {
    // req.user comes from authMiddleware
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      dob: user.dob,
      gender: user.gender,
      address: user.address,
      city: user.city,
      state: user.state,
      country: user.country,
      pincode: user.pincode,
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
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Update fields (only if provided)
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.avatar = req.body.avatar || user.avatar;
    user.dob = req.body.dob || user.dob;
    user.gender = req.body.gender || user.gender;
    user.address = req.body.address || user.address;
    user.city = req.body.city || user.city;
    user.state = req.body.state || user.state;
    user.country = req.body.country || user.country;
    user.pincode = req.body.pincode || user.pincode;

    // ✅ Mark profile as completed if basic fields are filled
    if (user.name && user.phone && user.dob && user.gender) {
      user.profileCompleted = true;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      dob: updatedUser.dob,
      gender: updatedUser.gender,
      address: updatedUser.address,
      city: updatedUser.city,
      state: updatedUser.state,
      country: updatedUser.country,
      pincode: updatedUser.pincode,
      profileCompleted: updatedUser.profileCompleted,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET CURRENT USER (Protected Route) ================= */
export const getCurrentUser = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verified: user.verified
      }
    });

  } catch (error) {
    console.error("Get Current User Error:", error);
    return res.status(500).json({ 
      message: "Error fetching user data",
      error: error.message 
    });
  }
};