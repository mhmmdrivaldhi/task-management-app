"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../lib/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const saltRounds = 10;
const signToken = (payload) => {
    if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined");
    }
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};
const registerUser = async (input) => {
    const name = input.name.trim();
    const email = input.email.trim();
    const password = input.password;
    if (!name || !email || !password)
        throw { status: 400, message: "name, email, and password are required" };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw { status: 400, message: "Invalid email format" };
    if (password.length < 6)
        throw { status: 400, message: "Password must be at least 6 characters" };
    const existing = await db_1.default.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rowCount && existing.rowCount > 0)
        throw { status: 409, message: "Email already registered" };
    const hashed = await bcrypt_1.default.hash(password, saltRounds);
    const { rows } = await db_1.default.query(`INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, created_at, updated_at`, [name, email, hashed]);
    if (!rows[0]) {
        throw { status: 500, message: "Failed to register user" };
    }
    return rows[0];
};
exports.registerUser = registerUser;
const loginUser = async (input) => {
    const { email, password } = input;
    if (!email || !password)
        throw { status: 400, message: "email and password are required" };
    const { rows } = await db_1.default.query("SELECT * FROM users WHERE email = $1", [email]);
    if (rows.length === 0)
        throw { status: 401, message: "Invalid credentials" };
    const user = rows[0];
    if (!user) {
        throw { status: 401, message: "Invalid credentials" };
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch)
        throw { status: 401, message: "Invalid credentials" };
    const token = signToken({ id: user.id, email: user.email });
    const { password: _pw, ...safeUser } = user;
    return { token, user: safeUser };
};
exports.loginUser = loginUser;
const getAllUsers = async () => {
    const { rows } = await db_1.default.query("SELECT id, name, email, created_at, updated_at FROM users");
    return rows;
};
exports.getAllUsers = getAllUsers;
const getUserById = async (id) => {
    const { rows } = await db_1.default.query("SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1", [id]);
    if (rows.length === 0)
        throw { status: 404, message: "User not found" };
    if (!rows[0]) {
        throw { status: 500, message: "Failed to retrieve user by id" };
    }
    return rows[0];
};
exports.getUserById = getUserById;
const updateUser = async (id, input) => {
    const existingUser = await db_1.default.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = existingUser.rows[0];
    if (!user)
        throw { status: 404, message: "User not found" };
    const name = input.name || user.name;
    const email = input.email || user.email;
    let password = user.password;
    if (input.password) {
        if (input.password.length < 6)
            throw { status: 400, message: "Password must be at least 6 characters" };
        password = await bcrypt_1.default.hash(input.password, saltRounds);
    }
    if (input.email) {
        const existingEmail = await db_1.default.query("SELECT id FROM users WHERE email = $1 AND id != $2", [input.email, id]);
        if (existingEmail.rowCount && existingEmail.rowCount > 0) {
            throw { status: 409, message: "Email already in use" };
        }
    }
    const { rows } = await db_1.default.query(`UPDATE users
     SET name = $1, email = $2, password = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING id, name, email, created_at, updated_at`, [name, email, password, id]);
    if (!rows[0]) {
        throw { status: 500, message: "Failed to update user" };
    }
    return rows[0];
};
exports.updateUser = updateUser;
const deleteUser = async (id) => {
    const { rowCount } = await db_1.default.query("DELETE FROM users WHERE id = $1", [id]);
    if (!rowCount || rowCount === 0)
        throw { status: 404, message: "User not found" };
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userService.js.map