"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, //
    },
});
const connectWithRetry = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("Connected to PostgreSQL");
    }
    catch (err) {
        console.log("DB sleeping, retrying...");
        setTimeout(connectWithRetry, 3000);
    }
};
connectWithRetry();
exports.default = pool;
//# sourceMappingURL=db.js.map