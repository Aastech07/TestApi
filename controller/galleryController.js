const Gallery = require("../models/galleryModel");
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

  const fileName = `Gallery/${file.originalname}`;
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
const uploadGallerieImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    const image = await Promise.all(req.files.map((file) => uploadImage(file)));

    if (!image.every((image) => image)) {
      return res
        .status(400)
        .json({ error: "Failed to upload one or more image" });
    }

    const updateData = { ...req.body, image };

    const updatedGallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedGallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    res.status(200).json(updatedGallery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find().populate("userId");
    res.json(galleries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getGalleryById = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createGallery = async (req, res) => {
  try {
    const newEvent = await Gallery.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New Gallery Post",
        message: `A new Gallery post "${newEvent.Albumtitle}" has been added.`,
        timestamp: Date.now(),
        isRead: false,
        userId: user._id,
      };

      console.log("Creating Notification:", notificationData);

      return Notification.create(notificationData);
    });

    await Promise.all(notificationPromises);

    console.log("Notifications sent to all users.");

    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating Gallery and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    res.json(gallery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndRemove(req.params.id).populate(
      "userId"
    );

    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    res.json({ message: "Gallery deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadGallerieImages,
  getAllGalleries,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
};
