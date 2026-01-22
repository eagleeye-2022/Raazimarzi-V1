import User from "../models/userModel.js";

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.passwordResetAllowed) {
      return res.status(403).json({ message: "OTP verification required" });
    }

    // ✅ plain password only
    user.password = newPassword;

    // 🔐 lock reset
    user.passwordResetAllowed = false;

    await user.save(); // password hashed automatically

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
