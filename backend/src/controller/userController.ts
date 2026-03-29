import { Request, Response, NextFunction } from "express";
import * as UserService from '../service/userService'
import { successResponse } from "../utils/response";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await UserService.registerUser(req.body);
        successResponse(res, 201, "User registered successfully", user);
    } catch (err) {
        next(err);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await UserService.loginUser(req.body);
    successResponse(res, 200, "User Login successfully", result);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await UserService.getAllUsers();
    successResponse(res, 200, "Users retrieved successfully", users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const user = await UserService.getUserById(Number(req.params.id));
    successResponse(res, 200, "User retrieved successfully", user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    const user = await UserService.updateUser(Number(req.params.id), req.body);
    successResponse(res, 200, "User updated successfully", user);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction
): Promise<void> => {
  try {
    await UserService.deleteUser(Number(req.params.id));
    successResponse(res, 200, "User deleted successfully", null);
  } catch (err) {
    next(err);
  }
};
