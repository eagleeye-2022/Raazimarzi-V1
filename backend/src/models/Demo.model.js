import mongoose from "mongoose";

const demoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Demo", demoSchema);
