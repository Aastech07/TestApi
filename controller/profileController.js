const Profile = require("../models/profileModel");
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

  const fileName = `Profile/${file.originalname}`;

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

const profileController = {
  getProfileById: async (req, res) => {
    try {
      const profile = await Profile.findById(req.params.id).populate("userId");
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  addProfile: async (req, res) => {
    try {
      const newProfile = new Profile(req.body);
      const savedProfile = await newProfile.save();
      res.status(201).json(savedProfile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getAllProfiles: async (req, res) => {
    try {
      const profiles = await Profile.find().populate("userId");
      res.status(200).json(profiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  searchProfileByName: async (req, res) => {
    try {
      const { fatherName } = req.query;

      if (!fatherName) {
        return res
          .status(400)
          .json({ message: "Please provide a fatherName parameter" });
      }
      const profiles = await Profile.find({
        fatherName: new RegExp(fatherName, "i"),
      });
      if (profiles.length === 0) {
        return res
          .status(404)
          .json({ message: "No profiles found with the provided fatherName" });
      }

      res.status(200).json(profiles);
    } catch (error) {
      console.error("Error in searchProfileByName:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
  getProfileById: async (req, res) => {
    try {
      const profile = await Profile.findById(req.params.id).populate("userId");
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteProfile: async (req, res) => {
    try {
      const deletedProfile = await Profile.findByIdAndDelete(req.params.id);
      if (!deletedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const updatedProfile = await Profile.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(200).json(updatedProfile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  uploadProfileImage: async (req, res) => {
    try {
      const file = req.file;
      const url = await uploadImage(file);
      const updateData = { ...req.body, url };

      const updatedProfile = await Profile.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.status(200).json(updatedProfile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = profileController;
