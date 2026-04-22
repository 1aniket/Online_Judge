import express from "express";
import runRoutes from "./routes/runRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", runRoutes);

app.listen(7000, () => {
  console.log("Compiler service running on port 7000");
});