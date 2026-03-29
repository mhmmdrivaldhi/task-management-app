import { Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import * as TaskService from '../service/taskService'
import { successResponse } from "../utils/response";

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await TaskService.createTask(req.body, req.user!.id);
    successResponse(res, 201, "Task created successfully", task);
  } catch (err) {
    next(err);
  }
};

export const getAllTasks = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tasks = await TaskService.getAllTasks();
    successResponse(res, 200, "Tasks retrieved successfully", tasks);
  } catch (err) {
    next(err);
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tasks = await TaskService.getMyTasks(req.user!.id);
    successResponse(res, 200, "Tasks retrieved successfully", tasks);
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await TaskService.getTaskById(Number(req.params.id));
    successResponse(res, 200, "Task retrieved successfully", task);
  } catch (err) {
    next(err);
  }
};

export const getTasksByUserId = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tasks = await TaskService.getTasksByUserId(Number(req.params.id));
    successResponse(res, 200, "Tasks retrieved successfully", tasks);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req: AuthRequest, res: Response,next: NextFunction): Promise<void> => {
  try {
    const task = await TaskService.updateTask(
      Number(req.params.id),
      req.body,
      req.user!.id
    );
    successResponse(res, 200, "Task updated successfully", task);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await TaskService.deleteTask(Number(req.params.id), req.user!.id);
    successResponse(res, 200, "Task deleted successfully", null);
  } catch (err) {
    next(err);
  }
};