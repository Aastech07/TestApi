const MatrimonialProfile = require("../models/matrimonialModel");
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
  const fileName = `Matrimonial/${file.originalname}`;

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
const matrimonialController = {
  getAllProfiles: async (req, res) => {
    try {
      const profiles = await MatrimonialProfile.find()
        .populate("userId")
        .populate("profileId");

      res.status(200).json(profiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getProfileById: async (req, res) => {
    try {
      const profile = await MatrimonialProfile.findById(req.params.id)
        .populate("userId")
        .populate("profileId");
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
      const newProfile = new MatrimonialProfile(req.body);
      const savedProfile = await newProfile.save();
      res.status(201).json(savedProfile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const updatedProfile = await MatrimonialProfile.findByIdAndUpdate(
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
  uploadMatrimonialProfileImage: async (req, res) => {
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

      const updatedMatrimonialProfile =
        await MatrimonialProfile.findByIdAndUpdate(req.params.id, updateData, {
          new: true,
        });

      if (!updatedMatrimonialProfile) {
        return res
          .status(404)
          .json({ message: "MatrimonialProfile not found" });
      }

      res.status(200).json(updatedMatrimonialProfile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteProfile: async (req, res) => {
    try {
      const deletedProfile = await MatrimonialProfile.findByIdAndDelete(
        req.params.id
      );
      if (!deletedProfile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  approveMatrimonial: async (req, res) => {
    try {
      const { matrimonialId } = req.params;

      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Unauthorized to approve matrimonials" });
      }

      const matrimonial = await MatrimonialProfile.findById(matrimonialId);
      if (!matrimonial) {
        return res.status(404).json({ message: "Matrimonial not found" });
      }

      matrimonial.isApproved = true;
      matrimonial.isPublic = true;
      await matrimonial.save();

      res
        .status(200)
        .json({ message: "Matrimonial approved successfully", matrimonial });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = matrimonialController;
