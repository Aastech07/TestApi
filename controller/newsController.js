const News = require("../models/newsModel");
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
  const fileName = `News/${file.originalname}`; 

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
const newsController = {
  getAllNews: async (req, res) => {
    try {
      const news = await News.find();
      res.status(200).json(news);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getNewsById: async (req, res) => {
    try {
      const newsItem = await News.findById(req.params.id);
      if (!newsItem) {
        return res.status(404).json({ message: "News not found" });
      }
      res.status(200).json(newsItem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  addNews: async (req, res) => {
    try {
      const NewNews = await News.create(req.body);
      const allUsers = await User.find({}, "username");
      const notificationPromises = allUsers.map((user) => {
        const notificationData = {
          title: "New News Post",
          message: `A new News post "${NewNews.title}" has been added.`,
          timestamp: Date.now(),
          isRead: false,
          userId: user._id,
        };

        console.log("Creating Notification:", notificationData);

        return Notification.create(notificationData);
      });

      await Promise.all(notificationPromises);

      console.log("Notifications sent to all users.");

      res.status(201).json(NewNews);
    } catch (error) {
      console.error("Error creating News and notifications:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  searchNewsByTitle: async (req, res) => {
    try {
      const { title } = req.query;

      if (!title) {
        return res
          .status(400)
          .json({ message: "Please provide a title parameter" });
      }

      const news = await News.find({ title: new RegExp(title, "i") });

      if (news.length === 0) {
        return res
          .status(404)
          .json({ message: "No news found with the provided title" });
      }

      res.status(200).json(news);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateNews: async (req, res) => {
    try {
      const updatedNews = await News.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedNews) {
        return res.status(404).json({ message: "News not found" });
      }
      res.status(200).json(updatedNews);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteNews: async (req, res) => {
    try {
      const deletedNews = await News.findByIdAndDelete(req.params.id);
      if (!deletedNews) {
        return res.status(404).json({ message: "News not found" });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  uploadNewsImage: async (req, res) => {
    try {
      const file = req.file;
      const image = await uploadImage(file);
      const updateData = { ...req.body, image };

      const updatedNews = await News.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );
      if (!updatedNews) {
        return res.status(404).json({ message: "News not found" });
      }
      res.status(200).json(updatedNews);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};
module.exports = newsController;
