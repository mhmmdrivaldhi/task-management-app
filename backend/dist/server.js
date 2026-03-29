"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("./lib/db");
const userRoutes_1 = __importDefault(require("../src/routes/userRoutes"));
const taskRoutes_1 = __importDefault(require("../src/routes/taskRoutes"));
const taskController_1 = require("./controller/taskController");
const errorHandler_1 = require("./utils/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
if (!PORT) {
    throw new Error("PORT is not defined in environment variables");
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/users", userRoutes_1.default);
app.use("/api/tasks", taskRoutes_1.default);
app.get("/api/users/:id/tasks", taskController_1.getTasksByUserId);
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map