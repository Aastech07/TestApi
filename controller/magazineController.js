const Magazine = require("../models/magazineModel");
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
  const fileName = `Magazine/${file.originalname}`;

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

const getAllMagazines = async (req, res) => {
  try {
    const magazines = await Magazine.find();
    res.json(magazines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const createMagazine = async (req, res) => {
//   const { title, date } = req.body;

//   try {
//     const newMagazine = new Magazine({
//       title,
//       date,
//     });

//     const savedMagazine = await newMagazine.save();
//     res.status(201).json(savedMagazine);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

const createMagazine= async (req, res) => {
  try {
    const newEvent = await Magazine.create(req.body);
    const allUsers = await User.find({}, "username");
    const notificationPromises = allUsers.map((user) => {
      const notificationData = {
        title: "New Magazine Post",
        message: `A new Magazine post "${newEvent.title}" has been added.`,
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
    console.error("Error creating Magazine and notifications:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const uploadMagazinepdf = async (req, res) => {
  try {
    const file = req.file;
    const image = await uploadImage(file);
    const updateData = { ...req.body, image };

    const updatedMagazine = await Magazine.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedMagazine) {
      return res.status(404).json({ message: "Magazine not found" });
    }
    res.status(200).json(updatedMagazine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMagazine = async (req, res) => {
  try {
    const deletedMagazine = await Magazine.findByIdAndDelete(req.params.id);
    if (!deletedMagazine) {
      return res.status(404).json({ message: "Magazine not found" });
    }
    res.status(200).json({ message: "Magazine deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMagazines,
  createMagazine,
  uploadImage,
  uploadMagazinepdf,
  deleteMagazine,
};
