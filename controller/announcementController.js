const Announcement = require("../models/AnanouncementModel");
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

const createAnnouncement = async (req, res) => {
  try {
    const { createdBy,date, announcementType, description } = req.body;
    const newAnnouncement = new Announcement({
      createdBy,
      date,
      announcementType,
      description,
    });
    const savedAnnouncement = await newAnnouncement.save();
    res.status(201).json(savedAnnouncement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().populate(
      "createdBy",
      "username"
    );
    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate(
      "createdBy",
      "username"
    );
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateAnnouncement = async (req, res) => {
  try {
    const { announcementType, description } = req.body;
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        announcementType,
        description,
      },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    res.json(updatedAnnouncement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const uploadAnnouncementImage = async (req, res) => {
  try {
    const file = req.file;
    const image = await uploadImage(file);
    const updateData = { ...req.body, image };

    const updateAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updateAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json(updateAnnouncement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const deleteAnnouncement = async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndRemove(
      req.params.id
    );
    if (!deletedAnnouncement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const updateAnnouncementStatus =async (req, res) => {
  const { id } = req.params;

  try {
    const announcement = await Announcement.findById(id);

    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

  
    announcement.isActive = true;

   
    await announcement.save();

    res.status(200).json({ message: "Announcement updated successfully", announcement });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = {
  updateAnnouncementStatus,
  createAnnouncement,
  getAllAnnouncements,
  updateAnnouncement,
  uploadAnnouncementImage,
  getAnnouncementById,
  deleteAnnouncement,
};
