const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || process.env.DB_DATABASE || "queen_gym",
  max: parseInt(process.env.DB_POOL_MAX || "10", 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || "30000", 10),
  ssl:
    process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

module.exports = { pool };
