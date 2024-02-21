const PgGuestHouse = require("../models/PgGuestHouseModel");
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

  const fileName = `PgGuestHouse/${file.originalname}`;
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
const uploadPgGuestHouseImages = async (req, res) => {
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

    const updatedFurniture = await PgGuestHouse.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedFurniture) {
      return res.status(404).json({ message: "PgGuestHouse not found" });
    }

    res.status(200).json(updatedFurniture);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getAllPgGuestHouses = async (req, res) => {
  try {
    const pgGuestHouses = await PgGuestHouse.find().populate("profileId");
    res.json(pgGuestHouses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPgGuestHouseById = async (req, res) => {
  try {
    const pgGuestHouse = await PgGuestHouse.findById(req.params.id).populate("profileId");
    if (!pgGuestHouse) {
      return res.status(404).json({ message: "PG or Guest House not found" });
    }
    res.json(pgGuestHouse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const createPgGuestHouse = async (req, res) => {
//   try {
//     const newPgGuestHouse = new PgGuestHouse(req.body);
//     await newPgGuestHouse.save();
//     res.status(201).json(newPgGuestHouse);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

const createPgGuestHouse = async (req, res) => {
  try {
    const newPgGuestHouse = await PgGuestHouse.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New PgGuestHouse Post",
        message: `A new PgGuestHouse post "${newPgGuestHouse.adTitle}" has been added.`,
        timestamp: Date.now(),
        isRead: false,
        userId: user._id,
      };

      console.log("Creating Notification:", notificationData);

      return Notification.create(notificationData);
    });

    await Promise.all(notificationPromises);

    console.log("Notifications sent to all users.");

    res.status(201).json(newPgGuestHouse);
  } catch (error) {
    console.error("Error creating PgGuestHouse and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updatePgGuestHouse = async (req, res) => {
  try {
    const pgGuestHouse = await PgGuestHouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!pgGuestHouse) {
      return res.status(404).json({ message: "PG or Guest House not found" });
    }

    res.json(pgGuestHouse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePgGuestHouse = async (req, res) => {
  try {
    const pgGuestHouse = await PgGuestHouse.findByIdAndRemove(req.params.id);

    if (!pgGuestHouse) {
      return res.status(404).json({ message: "PG or Guest House not found" });
    }

    res.json({ message: "PG or Guest House deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadPgGuestHouseImages,
  getAllPgGuestHouses,
  getPgGuestHouseById,
  createPgGuestHouse,
  updatePgGuestHouse,
  deletePgGuestHouse,
};
