const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserV1",
    required: true,
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },
  image: {
    type: String,
  },
  experience: {
    type: String,
    enum: ["Experienced", "Fresher"],
    default: "Fresher",
  },
  currentCTC: {
    type: String,
    default: 0,
  },
  noticePeriod: {
    type: String,
    default: "",
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
  expectedCTC: {
    type: String,
    required: true,
  },
  currentCompany: {
    type: String,
    default: "",
  },
  fromDate: {
    type: Date,
    default: undefined,
  },
  toDate: {
    type: Date,
    default: undefined,
  },
  roleAndResponsibility: {
    type: String,
    default: "",
  },
  yourPosition: {
    type: String,
    default: "",
  },
  linkedInProfile: {
    type: String,
    default: "",
  },
  githubProfile: {
    type: String,
    default: "",
  },
  portfolioLink: {
    type: String,
    default: "",
  },
  skills: {
    type: [String],
    default: [],
  },
  references: {
    type: [String],
    default: [],
  },
  workmode: {
    type: String,
    default: "",
  },
  willingnessToTravel: {
    type: Boolean,
    default: false,
  },
  relocated: {
    type: Boolean,
    default: false,
  },
  expectedJoiningDate: {
    type: Date,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
