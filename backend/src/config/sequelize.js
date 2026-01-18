const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialect: "postgres",
    logging: false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || "10", 10),
      idle: parseInt(process.env.DB_IDLE_TIMEOUT || "30000", 10),
    },
    dialectOptions:
      process.env.DB_SSL === "true"
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {},
  }
);

module.exports = { sequelize };
