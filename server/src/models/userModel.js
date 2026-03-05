import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    phone: { type: String },

    password: {
      type: String,
      required: true,
      select: false,
    },

    /* ── Roles ─────────────────────────────────────────
       user         → any regular person (claimant or respondent per case)
       case-manager → internal staff managing case lifecycle
       mediator     → neutral facilitator
       arbitrator   → neutral decision maker (binding awards)
       admin        → platform owner, full access
    ─────────────────────────────────────────────────── */
    role: {
      type: String,
      enum: ["user", "admin", "mediator", "arbitrator", "case-manager"],
      default: "user",
      index: true,
    },

    verified: { type: Boolean, default: true },

    avatar: { type: String, default: "" },

    dob: { type: String },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

    address:  { type: String },
    city:     { type: String },
    state:    { type: String },
    country:  { type: String, default: "India" },
    pincode:  { type: String },

    profileCompleted: { type: Boolean, default: false },

    /* ── Account Status (admin can suspend) ── */
    isActive:        { type: Boolean, default: true },
    suspendedAt:     { type: Date, default: null },
    suspendedReason: { type: String, default: "" },

    /* ── Mobile / Push Notifications (future mobile app) ── */
    fcmToken:   { type: String, default: "" },
    deviceType: {
      type: String,
      enum: ["web", "ios", "android"],
      default: "web",
    },

    /* ── Forgot Password ── */
    passwordResetOTP:       String,
    passwordResetOTPExpiry: Date,
    passwordResetAllowed:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* 🔐 HASH PASSWORD */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* 🔑 MATCH PASSWORD */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);