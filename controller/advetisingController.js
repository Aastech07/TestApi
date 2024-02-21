const Advertising = require("../models/advertisingModel");
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

  const fileName = `Advertising/${file.originalname}`;
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
const advertisingController = {
  getAllAdvertisements: async (req, res) => {
    try {
      const advertisements = await Advertising.find();
      res.status(200).json(advertisements);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAdvertisementById: async (req, res) => {
    try {
      const advertisement = await Advertising.findById(req.params.id);
      if (!advertisement) {
        return res.status(404).json({ message: "Advertisement not found" });
      }
      res.status(200).json(advertisement);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  addAdvertisement: async (req, res) => {
    try {
      const newAdvertisement = new Advertising(req.body);
      const savedAdvertisement = await newAdvertisement.save();
      res.status(201).json(savedAdvertisement);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  updateAdvertisement: async (req, res) => {
    try {
      const updatedAdvertisement = await Advertising.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedAdvertisement) {
        return res.status(404).json({ message: "Advertisement not found" });
      }
      res.status(200).json(updatedAdvertisement);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteAdvertisement: async (req, res) => {
    try {
      const deletedAdvertisement = await Advertising.findByIdAndDelete(
        req.params.id
      );
      if (!deletedAdvertisement) {
        return res.status(404).json({ message: "Advertisement not found" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  searchAdvertising: async (req, res) => {
    try {
      const { campaignName } = req.query;

      if (!campaignName) {
        return res
          .status(400)
          .json({ message: "Please provide a campaignName parameter" });
      }

      const advertisements = await Advertising.find({
        campaignName: new RegExp(campaignName, "i"),
      });

      if (advertisements.length === 0) {
        return res.status(404).json({
          message: "No advertisements found with the provided campaignName",
        });
      }

      res.status(200).json(advertisements);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  uploadAdvertisingImage: async (req, res) => {
    try {
      const file = req.file;
      const image = await uploadImage(file);
      const updateData = { ...req.body, image };

      const updatedAdvertising = await Advertising.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedAdvertising) {
        return res.status(404).json({ message: "Advertising not found" });
      }

      res.status(200).json(updatedAdvertising);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = advertisingController;
