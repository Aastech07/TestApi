const Event = require('../models/eventModel'); 
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

  const fileName = `Event/${file.originalname}`; 

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
const eventController = {
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.find();
      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getEventById: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  searchEventByTitle: async (req, res) => {
    try {
      const { title } = req.query;

      if (!title) {
        return res.status(400).json({ message: 'Please provide a title parameter' });
      }

      const events = await Event.find({ title: new RegExp(title, 'i') });

      if (events.length === 0) {
        return res.status(404).json({ message: 'No events found with the provided title' });
      }

      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  addEvent: async (req, res) => {
    try {
      const newEvent = await Event.create(req.body);
      const allUsers = await User.find({}, "username");
      const notificationPromises = allUsers.map((user) => {
        const notificationData = {
          title: "New Event Post",
          message: `A new event post "${newEvent.title}" has been added.`,
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
      console.error("Error creating event and notifications:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  updateEvent: async (req, res) => {
    try {
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  uploadEventImage: async (req, res) => {
    try {
      const file = req.file;
      const image = await uploadImage(file);
      const updateData = { ...req.body, image };

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteEvent: async (req, res) => {
    try {
      const deletedEvent = await Event.findByIdAndDelete(req.params.id);
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(204).json();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = eventController;
