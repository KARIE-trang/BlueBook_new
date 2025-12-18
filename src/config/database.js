const mysql = require("mysql2/promise");
require("dotenv").config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: "utf8mb4",
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
});

module.exports = connection;
