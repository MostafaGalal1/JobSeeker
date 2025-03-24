const express = require("express");
const { getAllJobs, getJobById, createJob, createJobs, updateJob, deleteJob } = require("../controllers/jobController");

const router = express.Router();

router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", createJob);
router.post("/bulk", createJobs);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
