const LandPlot = require("../models/LandPlotModel");
const mongoose = require("mongoose");
const User = require("../models/userV1Model");
const Notification = require("../models/notificationModel");

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

  const fileName = `LandPlot/${file.originalname}`;
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

const uploadLandPlotImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const images = await Promise.all(
      req.files.map((file) => uploadImage(file))
    );

    if (!images.every((image) => image)) {
      return res
        .status(400)
        .json({ error: "Failed to upload one or more images" });
    }

    const updateData = { ...req.body, images };

    const updatedFurniture = await LandPlot.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFurniture) {
      return res.status(404).json({ message: "LandPlot not found" });
    }

    res.status(200).json(updatedFurniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllLandPlots = async (req, res) => {
  try {
    const landPlots = await LandPlot.find().populate("profileId");
    res.json(landPlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLandPlotById = async (req, res) => {
  try {
    const landPlot = await LandPlot.findById(req.params.id).populate(
      "profileId"
    );
    if (!landPlot) {
      return res.status(404).json({ message: "Land plot not found" });
    }
    res.json(landPlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLandPlot = async (req, res) => {
  try {
    const newLandPlot = await LandPlot.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New LandPlot Post",
        message: `A new LandPlot post "${newLandPlot.title}" has been added.`,
        timestamp: Date.now(),
        isRead: false,
        userId: user._id,
      };

      console.log("Creating Notification:", notificationData);

      return Notification.create(notificationData);
    });

    await Promise.all(notificationPromises);

    console.log("Notifications sent to all users.");

    res.status(201).json(newLandPlot);
  } catch (error) {
    console.error("Error creating LandPlot and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateLandPlot = async (req, res) => {
  try {
    const landPlot = await LandPlot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!landPlot) {
      return res.status(404).json({ message: "Land plot not found" });
    }

    res.json(landPlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteLandPlot = async (req, res) => {
  try {
    const landPlot = await LandPlot.findByIdAndRemove(req.params.id);

    if (!landPlot) {
      return res.status(404).json({ message: "Land plot not found" });
    }

    res.json({ message: "Land plot deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadLandPlotImages,
  getAllLandPlots,
  getLandPlotById,
  createLandPlot,
  updateLandPlot,
  deleteLandPlot,
};
