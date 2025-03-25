const { publishToQueue } = require("../config/mq");
const pool = require("../config/db");
const format = require("pg-format");

const searchJobs = async (req, res) => {
  try {
    const { query } = req.query;

    const esQuery = {
      query: {
        bool: {
          should: [
            { match: { "jobs.job_title": query } },
            { match: { "jobs.company_name": query } },
            { match: { "jobs.job_type": query } },
            { match: { "jobs.experience_years": query } },
            { match: { "jobs.experience_level": query } },
            { match: { "jobs.salary": query } },
            { match: { "jobs.city": query } },
            { match: { "jobs.country": query } }
          ],
        },
      },
    };

    const esResponse = await fetch("http://localhost:9200/jobs_index/_search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(esQuery),
    });

    const data = await esResponse.json();
    const jobs = data.hits.hits.map((hit) => hit._source.jobs);

    res.json(jobs);
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createJob = async (req, res) => {
  try {
    const {
      job_id, job_title, company_name, job_type, experience_years,
      experience_level, salary, city, country, job_url
    } = req.body;

    const query = `
      INSERT INTO jobs (job_id, job_title, company_name, job_type, experience_years, experience_level, salary, city, country, job_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [job_id, job_title, company_name, job_type, experience_years, experience_level, salary, city, country, job_url];
    const result = await pool.query(query, values);
    
    await publishToQueue({ action: "create", job: result.rows[0] });

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createJobs = async (req, res) => {
  try {
    const jobs = req.body;

    if (!Array.isArray(jobs)) {
      return res.status(400).json({ error: "Invalid input: Expected a non-empty array of jobs" });
    }

    const query = format(
      `
      INSERT INTO jobs (job_id, job_title, company_name, job_type, experience_years, experience_level, salary, city, country, job_url)
      VALUES %L
      RETURNING *;
      `,
      jobs.map(job => [
        job.job_id, job.job_title, job.company_name, job.job_type,
        job.experience_years, job.experience_level, job.salary,
        job.city, job.country, job.job_url
      ])
    );
    const result = await pool.query(query);

    await Promise.all(result.rows.map(job => publishToQueue({ action: "create", job })));

    res.status(201).json(result.rows);
  } catch (error) {
    console.error("Error inserting jobs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      job_title, company_name, job_type, experience_years, experience_level,
      salary, city, country, job_url
    } = req.body;

    const query = `
      UPDATE jobs 
      SET job_title = $1, company_name = $2, job_type = $3, experience_years = $4, 
          experience_level = $5, salary = $6, city = $7, country = $8, job_url = $9
      WHERE job_id = $10
      RETURNING *;
    `;

    const values = [job_title, company_name, job_type, experience_years, experience_level, salary, city, country, job_url, id];
    const result = await pool.query(query, values);
    
    await publishToQueue({ action: "update", job: result.rows[0] });

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
    const query = "SELECT * FROM jobs WHERE job_id = $1";
    const result = await pool.query(query, [id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "DELETE FROM jobs WHERE job_id = $1";
    await pool.query(query, [id]);
    res.json({ message: "Job deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { searchJobs, createJob, createJobs, updateJob, getAllJobs, getJobById, deleteJob };
