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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.login = exports.register = void 0;
const UserService = __importStar(require("../service/userService"));
const response_1 = require("../utils/response");
const register = async (req, res, next) => {
    try {
        const user = await UserService.registerUser(req.body);
        (0, response_1.successResponse)(res, 201, "User registered successfully", user);
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const result = await UserService.loginUser(req.body);
        (0, response_1.successResponse)(res, 200, "User Login successfully", result);
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
const getAllUsers = async (_req, res, next) => {
    try {
        const users = await UserService.getAllUsers();
        (0, response_1.successResponse)(res, 200, "Users retrieved successfully", users);
    }
    catch (err) {
        next(err);
    }
};
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res, next) => {
    try {
        const user = await UserService.getUserById(Number(req.params.id));
        (0, response_1.successResponse)(res, 200, "User retrieved successfully", user);
    }
    catch (err) {
        next(err);
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res, next) => {
    try {
        const user = await UserService.updateUser(Number(req.params.id), req.body);
        (0, response_1.successResponse)(res, 200, "User updated successfully", user);
    }
    catch (err) {
        next(err);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    try {
        await UserService.deleteUser(Number(req.params.id));
        (0, response_1.successResponse)(res, 200, "User deleted successfully", null);
    }
    catch (err) {
        next(err);
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map