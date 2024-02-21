const Fashion = require("../models/fashionModel");
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

  const fileName = `Fashion/${file.originalname}`;
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

const uploadFashionImages = async (req, res) => {
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

    const updatedFashion = await Fashion.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFashion) {
      return res.status(404).json({ message: "Fashion not found" });
    }

    res.status(200).json(updatedFashion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllFashion = async (req, res) => {
  try {
    const fashionItems = await Fashion.find().populate("profileId");
    res.json(fashionItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFashionById = async (req, res) => {
  try {
    const fashionItem = await Fashion.findById(req.params.id).populate(
      "profileId"
    );
    if (!fashionItem) {
      return res.status(404).json({ message: "Fashion item not found" });
    }
    res.json(fashionItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const createFashion = async (req, res) => {
//   const fashion = new Fashion({
//     profileId: req.body.profileId,
//     fashionType: req.body.fashionType,
//     adTitle: req.body.adTitle,
//     price: req.body.price,
//     description: req.body.description,
//     address: req.body.address,
//     landmark: req.body.landmark,
//   });

//   try {
//     const newFashion = await fashion.save();
//     res.status(201).json(newFashion);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


const createFashion = async (req, res) => {
  try {
    const newFurniture = await Fashion.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New Fashion Post",
        message: `A new Fashion post "${newFurniture.adTitle}" has been added.`,
        timestamp: Date.now(),
        isRead: false,
        userId: user._id,
      };

      console.log("Creating Notification:", notificationData);

      return Notification.create(notificationData);
    });

    await Promise.all(notificationPromises);

    console.log("Notifications sent to all users.");

    res.status(201).json(newFurniture);
  } catch (error) {
    console.error("Error creating Fashion and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateFashion = async (req, res) => {
  try {
    const updatedFashion = await Fashion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedFashion) {
      return res.status(404).json({ message: "Fashion not found" });
    }
    res.status(200).json(updatedFashion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFashion = async (req, res) => {
  try {
    const fashion = await Fashion.findById(req.params.id);

    if (!fashion) {
      return res.status(404).json({ message: "Fashion item not found" });
    }

    await fashion.remove();
    res.json({ message: "Fashion item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  uploadFashionImages,
  getAllFashion,
  getFashionById,
  createFashion,
  updateFashion,
  deleteFashion,
};
