import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  caseId: { type: String, required: true },
  title: { type: String, required: true },
  party1: { type: String },
  party2: { type: String },
  mediator: { type: String },
  category: { type: String },
  status: { type: String, default: "Active" },
  createdAt: { type: Date, default: Date.now },
});

const Case = mongoose.model("Case", caseSchema);
export default Case;
