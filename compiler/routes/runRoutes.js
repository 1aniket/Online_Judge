// compiler/routes/runRoutes.js
import express from "express";
import { runCode } from "../controllers/runController.js";
import { verifyInternalRequest } from "../middlewares/auth.js";

const router = express.Router();

router.post("/run", verifyInternalRequest, runCode);

export default router;