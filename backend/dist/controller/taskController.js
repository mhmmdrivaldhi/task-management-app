"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasksByUserId = exports.getTaskById = exports.getMyTasks = exports.getAllTasks = exports.createTask = void 0;
const TaskService = __importStar(require("../service/taskService"));
const response_1 = require("../utils/response");
const createTask = async (req, res, next) => {
    try {
        const task = await TaskService.createTask(req.body, req.user.id);
        (0, response_1.successResponse)(res, 201, "Task created successfully", task);
    }
    catch (err) {
        next(err);
    }
};
exports.createTask = createTask;
const getAllTasks = async (_req, res, next) => {
    try {
        const tasks = await TaskService.getAllTasks();
        (0, response_1.successResponse)(res, 200, "Tasks retrieved successfully", tasks);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllTasks = getAllTasks;
const getMyTasks = async (req, res, next) => {
    try {
        const tasks = await TaskService.getMyTasks(req.user.id);
        (0, response_1.successResponse)(res, 200, "Tasks retrieved successfully", tasks);
    }
    catch (err) {
        next(err);
    }
};
exports.getMyTasks = getMyTasks;
const getTaskById = async (req, res, next) => {
    try {
        const task = await TaskService.getTaskById(Number(req.params.id));
        (0, response_1.successResponse)(res, 200, "Task retrieved successfully", task);
    }
    catch (err) {
        next(err);
    }
};
exports.getTaskById = getTaskById;
const getTasksByUserId = async (req, res, next) => {
    try {
        const tasks = await TaskService.getTasksByUserId(Number(req.params.id));
        (0, response_1.successResponse)(res, 200, "Tasks retrieved successfully", tasks);
    }
    catch (err) {
        next(err);
    }
};
exports.getTasksByUserId = getTasksByUserId;
const updateTask = async (req, res, next) => {
    try {
        const task = await TaskService.updateTask(Number(req.params.id), req.body, req.user.id);
        (0, response_1.successResponse)(res, 200, "Task updated successfully", task);
    }
    catch (err) {
        next(err);
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res, next) => {
    try {
        await TaskService.deleteTask(Number(req.params.id), req.user.id);
        (0, response_1.successResponse)(res, 200, "Task deleted successfully", null);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=taskController.js.map