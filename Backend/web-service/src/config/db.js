const { Pool } = require("pg");
const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT } = require("./env");

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

module.exports = pool;