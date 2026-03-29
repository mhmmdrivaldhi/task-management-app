import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
  ssl: {
    rejectUnauthorized: false, //
  },
});

const connectWithRetry = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.log("DB sleeping, retrying...");
    setTimeout(connectWithRetry, 3000);
  }
};

connectWithRetry();

export default pool;