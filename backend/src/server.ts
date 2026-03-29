import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import "./lib/db"
import userRoutes from '../src/routes/userRoutes'
import taskRoutes from '../src/routes/taskRoutes'
import { getTasksByUserId } from "./controller/taskController";
import { errorHandler } from "./utils/errorHandler";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("PORT is not defined in environment variables");
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes)
app.use("/api/tasks", taskRoutes)
app.get("/api/users/:id/tasks", getTasksByUserId)

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});