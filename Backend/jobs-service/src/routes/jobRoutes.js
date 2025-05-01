const express = require("express");
const { searchJobs, getAllJobs, getJobById, createJob, createJobs, updateJob, deleteJob } = require("../controllers/jobControllers");

const router = express.Router();

router.get("/search", searchJobs);
router.get("/", getAllJobs);
router.get("/:id", getJobById);
router.post("/", createJob);
router.post("/bulk", createJobs);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

module.exports = router;
