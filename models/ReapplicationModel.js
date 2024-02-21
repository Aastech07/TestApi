const mongoose = require("mongoose");

const newApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const JobApplication = mongoose.model("NewApplication", newApplicationSchema);

module.exports = JobApplication;
