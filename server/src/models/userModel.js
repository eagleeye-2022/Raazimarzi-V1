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

    role: {
      type: String,
      enum: ["user", "admin", "mediator", "case-manager"],
      default: "user",
    },

    verified: {
      type: Boolean,
      default: true,
    },

    // ✅ UPDATED: Store avatar filename only
    avatar: {
      type: String,
      default: "", // Empty string means no avatar uploaded
    },

    dob: { type: String },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String, default: "India" },
    pincode: { type: String },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    /* 🔐 Forgot Password */
    passwordResetOTP: String,
    passwordResetOTPExpiry: Date,
    passwordResetAllowed: {
      type: Boolean,
      default: false,
    },
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