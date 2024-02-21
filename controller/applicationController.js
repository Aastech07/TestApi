const Application = require("../models/applicationModel");
const NewApplication = require("../models/ReapplicationModel");
const AWS = require("aws-sdk");
const fs = require("fs");

const uploadImage = async (file) => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  const region = "AP-SOUTH-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_KEY;

  const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
  });
  const fileName = `Application/${file.originalname}`;

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileStream,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading to S3:", err);
        reject(err);
      }
      console.log("S3 Upload Data:", data);
      resolve(data.Location);
    });
  });
};
const applyForJob = async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId")
      .populate("jobId")
      .populate("profileId")
      .exec();

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("userId")
      .populate("jobId")
      .populate("profileId")
      .exec();

    if (!application) {
      return res.status(404).json({ error: "Job Application not found" });
    }

    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateApplicationById = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ error: "Job Application not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteApplicationById = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ error: "Job Application not found" });
    }
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const uploadResume = async (req, res) => {
  try {
    const file = req.file;
    const image = await uploadImage(file);
    const updateData = { ...req.body, image };

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json(updatedApplication);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const reApplyApplication = async (req, res) => {
  try {
    const { jobId, applicationId } = req.body;

    const newJobApplication = new NewApplication({
      jobId: jobId,
      applicationId: applicationId,
    });
    const savedJobApplication = await newJobApplication.save();

    res.status(201).json(savedJobApplication);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getReAllJobApplications = async (req, res) => {
  try {
    const jobApplications = await NewApplication.find()
    .populate("jobId")
    .populate("applicationId")
    .exec();

    res.status(200).json(jobApplications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  applyForJob,
  getAllApplications,
  getApplicationById,
  updateApplicationById,
  deleteApplicationById,
  uploadResume,
  reApplyApplication,
  getReAllJobApplications
};
