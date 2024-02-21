const express = require("express");
const router = express.Router();
const jobController = require("../controller/jobController");
const { authmiddleware, AproveAdmin } = require("../middleware/authmiddleware");

// Routes
router.get("/jobs/search", jobController.searchJobByTitle);
router.get("/jobs", jobController.getAllJobs);
router.get("/jobs/:id", jobController.getJobById);
router.post("/jobs", jobController.addJob);
router.put("/jobs/:id", jobController.updateJob);
router.delete("/jobs/:id", jobController.deleteJob);
router.put(
    "/jobs/approve/:jobId",
    authmiddleware,
    AproveAdmin,
    jobController.addJob
  );
module.exports = router;
