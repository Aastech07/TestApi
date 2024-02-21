const express = require("express");
const router = express.Router();
const announcementController = require("../controller/announcementController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/announcements", announcementController.createAnnouncement);
router.get("/announcements", announcementController.getAllAnnouncements);
router.get("/announcements/:id", announcementController.getAnnouncementById);
router.delete("/announcements/:id", announcementController.deleteAnnouncement);
router.put("/announcements/:id", announcementController.updateAnnouncement);
router.put("/updateAnnouncementStatus/:id", announcementController.updateAnnouncementStatus);
router.post(
  "/announcements/:id",
  upload.single("image"),
  announcementController.uploadAnnouncementImage
);
module.exports = router;
