const Property = require("../models/propertyModel");
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

  const fileName = `Property/${file.originalname}`;
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

const uploadPropertyImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }

    // Assuming you have an `uploadImage` function defined elsewhere
    const uploadedImages = await Promise.all(
      req.files.map((file) => uploadImage(file))
    );

    if (!uploadedImages.every((image) => image)) {
      return res
        .status(400)
        .json({ error: "Failed to upload one or more images" });
    }

    // Update the property with the uploaded images
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { image: uploadedImages, ...req.body },
      { new: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const createProperty = async (req, res) => {
  try {
    const newProperty = await Property.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New Property Post",
        message: `A new Property post "${newProperty.adTitle}" has been added.`,
        timestamp: Date.now(),
        isRead: false,
        userId: user._id,
      };

      console.log("Creating Notification:", notificationData);

      return Notification.create(notificationData);
    });

    await Promise.all(notificationPromises);

    console.log("Notifications sent to all users.");

    res.status(201).json(newProperty);
  } catch (error) {
    console.error("Error creating Property and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllProperties = async (req, res) => {
  try {
    const allProperties = await Property.find().populate("profileId");
    res.status(200).json(allProperties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("profileId");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndRemove(req.params.id);
    if (!deletedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  uploadPropertyImages,
};
