import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import * as TaskController from "../controller/taskController";

const router = Router();

router.post("/", authenticate, TaskController.createTask);
router.get("/", TaskController.getAllTasks);
router.get("/my-tasks", authenticate, TaskController.getMyTasks);
router.get("/:id", TaskController.getTaskById);
router.put("/:id", authenticate, TaskController.updateTask);
router.delete("/:id", authenticate, TaskController.deleteTask);

export default router;