// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import { protect } from "./middlewares/authMiddleware.js";
import questionRoutes from "./routes/questionRoute.js";
import { runCode } from "./controllers/runCode.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);


//Routes which require authentication.
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

app.post("/api/run", async (req, res) => {
  try {
    const codeOutput = await runCode(req, res);
    console.log("Code output:", codeOutput);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to load code runner" });
  }});

app.listen(5000, () => console.log("Server running on port 5000"));