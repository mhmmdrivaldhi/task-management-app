"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTasksByUserId = exports.getTaskById = exports.getMyTasks = exports.getAllTasks = exports.createTask = void 0;
const db_1 = __importDefault(require("../lib/db"));
const createTask = async (input, userId) => {
    const { title, description = null, completed = false } = input;
    if (!title || title.trim() === "")
        throw { status: 400, message: "Title is required" };
    const { rows } = await db_1.default.query(`INSERT INTO tasks (title, description, completed, user_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`, [title.trim(), description, completed, userId]);
    if (!rows[0]) {
        throw { status: 500, message: "Failed to created task" };
    }
    return rows[0];
};
exports.createTask = createTask;
const getAllTasks = async () => {
    const { rows } = await db_1.default.query("SELECT * FROM tasks ORDER BY created_at DESC");
    return rows;
};
exports.getAllTasks = getAllTasks;
const getMyTasks = async (userId) => {
    const { rows } = await db_1.default.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    return rows;
};
exports.getMyTasks = getMyTasks;
const getTaskById = async (id) => {
    const { rows } = await db_1.default.query("SELECT * FROM tasks WHERE id = $1", [id]);
    if (rows.length === 0)
        throw { status: 404, message: "Task not found" };
    if (!rows[0]) {
        throw { status: 500, message: "Failed to retrieve task by id" };
    }
    return rows[0];
};
exports.getTaskById = getTaskById;
const getTasksByUserId = async (userId) => {
    const { rows } = await db_1.default.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    return rows;
};
exports.getTasksByUserId = getTasksByUserId;
const updateTask = async (id, input, requesterId) => {
    const task = await (0, exports.getTaskById)(id);
    if (task.user_id !== requesterId)
        throw { status: 403, message: "Forbidden: you do not own this task" };
    const title = input.title !== undefined ? input.title : task.title;
    const description = input.description !== undefined ? input.description : task.description;
    const completed = input.completed !== undefined ? input.completed : task.completed;
    const { rows } = await db_1.default.query(`UPDATE tasks
     SET title = $1, description = $2, completed = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING *`, [title, description, completed, id]);
    if (!rows[0]) {
        throw { status: 500, message: "Failed to updated task" };
    }
    return rows[0];
};
exports.updateTask = updateTask;
const deleteTask = async (id, requesterId) => {
    const task = await (0, exports.getTaskById)(id);
    if (task.user_id !== requesterId)
        throw { status: 403, message: "Forbidden: you do not own this task" };
    await db_1.default.query("DELETE FROM tasks WHERE id = $1", [id]);
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=taskService.js.map