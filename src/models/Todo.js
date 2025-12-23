import mongoose from "mongoose";


const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "Title cannot be empty"]
  },
  description: {
    type: String,
    default: "",        
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true     
  },
});

export default mongoose.model("Todo", todoSchema);