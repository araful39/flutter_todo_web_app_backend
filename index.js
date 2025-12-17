// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";


// dotenv.config();

// import Todo from "./models/Todo.js";

// const app=express();

// app.use(cors());

// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI).then(()=>console.log("MongDB Connected")).catch(err =>console.error(" MongoDB Connection Failed", err));

// app.get("/todos", async(req,res) => {
// try{
//  const todos= await Todo.find();
//  res.json(todos);


// }
// catch(e){

//     res.status(500).json({message:err.message});

// }
// });
// // app.get("/", (req,res)=>{
// // res.json("server run raju");
// // });


// app.post("/todos",async(req,res)=>{
// try{

//     if(req.body.title ==null)return res.status(401).json({message:"title required"});

//    const todo= new Todo(
//         {title:req.body.title,
//             description:req.body.des,
//             createdAt:req.body.createdAt
//         }
//     );
// const newTodo=await todo.save()
//     res.status(201).json(newTodo);
// }
// catch(e){

//     res.status(400).json({message:err.message})

// }
// });


// const PORT =process.env.PORT || 5000;
// app.listen(PORT,()=>{

// console.log(`🚀 Server running on port ${PORT}`);
// });


import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import Todo from "./models/Todo.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Failed", err));

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (e) {
    // Fixed: was 'err' → now 'e'
    res.status(500).json({ message: e.message });
  }
});

app.post("/todos", async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ message: "title is required" });
    }
    if (!req.body.description) {
      return res.status(400).json({ message: "description is required" });
    }
    //ss

    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,      
      createdAt: req.body.createdAt,
    });

    const newTodo = await todo.save();
    const cleanedTodo = {
      id: newTodo._id.toString(),
      title: newTodo.title,
      description: newTodo.description,
      createdAt: newTodo.createdAt
    };

    res.status(201).json(cleanedTodo);

  } catch (e) {
    // Fixed: was 'err' → now 'e'
    res.status(400).json({ message: e.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});