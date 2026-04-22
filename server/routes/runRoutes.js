// server/routes/runRoutes.js
import express from "express";
import { runCode } from "../controllers/runController.js";

const router = express.Router();

router.post("/run", runCode);

export default router;