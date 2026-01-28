import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, 
    },
  },
  { timestamps: true }
);

// Create index for faster queries
otpSchema.index({ email: 1, expiresAt: 1 });

export default mongoose.model("Otp", otpSchema);