const pool = require("../config/db");
const format = require("pg-format");

const getAllJobs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM jobs WHERE job_id = $1", [id]);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createJob = async (req, res) => {
  try {
    const {
      job_id,
      job_title,
      company_name,
      job_type,
      experience_years,
      experience_level,
      salary,
      city,
      country,
      job_url
    } = req.body;

    const query = `
      INSERT INTO jobs (job_id, job_title, company_name, job_type, experience_years, experience_level, salary, city, country, job_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      job_id, job_title, company_name, job_type, experience_years, 
      experience_level, salary, city, country, job_url
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createJobs = async (req, res) => {
  try {
    const { jobs } = req.body;

    const query = `
      INSERT INTO jobs (job_id, job_title, company_name, job_type, experience_years, experience_level, salary, city, country, job_url)
      VALUES %L;
    `;

    const values = jobs.map(job => [
      job.job_id, job.job_title, job.company_name, job.job_type, job.experience_years,
      job.experience_level, job.salary, job.city, job.country, job.job_url
    ]);

    const formattedQuery = format(query, values);
    const result = await pool.query(formattedQuery);
    res.status(201).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      job_title,
      company_name,
      job_type,
      experience_years,
      experience_level,
      salary,
      city,
      country,
      job_url
    } = req.body;

    const query = `
      UPDATE jobs 
      SET job_title = $1, company_name = $2, job_type = $3, experience_years = $4, 
          experience_level = $5, salary = $6, city = $7, country = $8, job_url = $9
      WHERE job_id = $10
      RETURNING *;
    `;

    const values = [
      job_title, company_name, job_type, experience_years, experience_level, 
      salary, city, country, job_url, id
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM jobs WHERE job_id = $1", [id]);
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  createJobs,
  updateJob,
  deleteJob,
};