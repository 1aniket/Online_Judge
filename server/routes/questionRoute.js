import express from "express";
import { createQuestion, deleteQuestion, getAllQuestions, getQuestionById } from "../controllers/questionController.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {protect} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/create", protect, adminMiddleware, createQuestion);
router.get("/", getAllQuestions);
router.get("/:id", getQuestionById); 
router.delete("/:id", protect, adminMiddleware, deleteQuestion);

export default router;