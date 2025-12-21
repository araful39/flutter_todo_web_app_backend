import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Todo from "../models/Todo.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "title and description required" });
    }

    const todo = new Todo({ title, description });
    const newTodo = await todo.save();

    res.status(201).json({
      id: newTodo._id.toString(),
      title: newTodo.title,
      description: newTodo.description,
      createdAt: newTodo.createdAt
    });

  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// ✅ START SERVER ONLY AFTER DB CONNECTS
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB Connection Failed", error);
    process.exit(1);
  }
};

startServer();
