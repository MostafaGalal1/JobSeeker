const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const compression = require("compression");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(compression());
app.use(express.json());

const router = express.Router();

// Route to get all jobs
router.get("/jobs", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/JobSeeker", router);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
