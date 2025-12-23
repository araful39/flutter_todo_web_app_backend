import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Todo from "./models/Todo.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format. Use double quotes and valid JSON."
    });
  }
  next();
});

/* ---------- Routes ---------- */
app.get("/", (req, res) => {
  res.send("Todo API running 🚀");
});
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
//ss

 app.delete('/todos/:id', async(req,res) => {

try{
    const { id } = req.params;
console.log('Deleting Todo with ID:', id);

 const deletedTodo= await Todo.findByIdAndDelete(id);
if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found with this ID' });
    }

 res.status(200).json({message:"Todo delete successfully",deletedTodo: deletedTodo});

}
catch(error){
 console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
}


 });

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

   
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        description: description ? description.trim() : "", 
      },
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    res.json(updatedTodo); 

  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    console.error("Error updating todo:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a todo by ID - সঠিক পাথ সহ
// app.delete('/todos/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log('Deleting Todo with ID:', id); // ← ঠিক করা হয়েছে

//     const deletedTodo = await Todo.findByIdAndDelete(id);

//     if (!deletedTodo) {
//       return res.status(404).json({ message: 'Todo not found with this ID' });
//     }

//     res.status(200).json({
//       message: 'Todo deleted successfully',
//       deletedTodo // ঐচ্ছিক: কী ডিলিট হয়েছে সেটা দেখানোর জন্য
//     });
//   } catch (error) { // ← e → error করা হয়েছে
//     console.error('Error deleting todo:', error);
//     res.status(500).json({
//       message: 'Server error',
//       error: error.message
//     });
//   }
// });

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
