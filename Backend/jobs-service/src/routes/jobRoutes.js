const express = require("express");
const {
  searchJobs,
  getAllJobs,
  getJobById,
  createJob,
  createJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobControllers");

const router = express.Router();

/**
 * @swagger
 * /jobs/search:
 *   get:
 *     summary: Search for jobs
 *     description: Search for jobs based on query parameters
 *     responses:
 *       200:
 *         description: A list of jobs
 */
router.get("/search", searchJobs);

/**
 * @swagger
 * /jobs:
 *  get:
 *    summary: Get all jobs
 *    description: Retrieve a list of all jobs
 *    responses:
 *      200:
 *        description: A list of jobs
 *      500:
 *        description: Internal server error
 */
router.get("/", getAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *  get:
 *    summary: Get a job by ID
 *    description: Retrieve a job by its ID
 *    responses:
 *      200:
 *        description: A job object
 *      404:
 *        description: Job not found
 *      500:
 *        description: Internal server error
 */
router.get("/:id", getJobById);

/**
 * @swagger
 * /jobs:
 *  post:
 *    summary: Create a new job
 *    description: Create a new job with the provided data
 *    responses:
 *      201:
 *        description: Job created successfully
 *      400:
 *        description: Bad request
 *      500:
 *        description: Internal server error
 */
router.post("/", createJob);

/**
 * @swagger
 * /jobs/bulk:
 *  post:
 *    summary: Create multiple jobs
 *    description: Create multiple jobs with the provided data
 *    responses:
 *      201:
 *        description: Jobs created successfully
 *      400:
 *        description: Bad request
 *      500:
 *        description: Internal server error
 */
router.post("/bulk", createJobs);

/**
 * @swagger
 * /jobs/{id}:
 *  put:
 *    summary: Update a job by ID
 *    description: Update a job with the provided data
 *    responses:
 *      200:
 *        description: Job updated successfully
 *      404:
 *        description: Job not found
 *      500:
 *        description: Internal server error
 */
router.put("/:id", updateJob);

/**
 * @swagger
 * /jobs/{id}:
 *  delete:
 *    summary: Delete a job by ID
 *    description: Delete a job by its ID
 *    responses:
 *      200:
 *        description: Job deleted successfully
 *      404:
 *        description: Job not found
 *      500:
 *        description: Internal server error
 */
router.delete("/:id", deleteJob);

module.exports = router;
