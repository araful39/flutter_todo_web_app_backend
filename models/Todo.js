import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // Fixed spelling
  createdAt: { type: Date, default: Date.now }, // Fixed spelling
});

export default mongoose.model("Todo", todoSchema);