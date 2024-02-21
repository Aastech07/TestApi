const express = require('express');
const router = express.Router();
const eventController = require('../controller/eventController');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// Routes
router.get('/events/search', eventController.searchEventByTitle);
router.post('/events', eventController.addEvent);
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.post(
    "/uploadImage/event/:id",
    upload.single("image"),
    eventController.uploadEventImage
  );
module.exports = router;
