const express = require("express");
const router = express.Router();
const profileController = require("../controller/profileController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/profiles", profileController.getAllProfiles);
router.get("/profiles/:id", profileController.getProfileById);
router.post("/profiles", profileController.addProfile);
router.put("/profiles/:id", profileController.updateProfile);
router.delete("/profiles/:id", profileController.deleteProfile);
router.get("/profiles/search", profileController.searchProfileByName);
router.post(
  "/uploadImage/profiles/:id",
  upload.single("url"),
  profileController.uploadProfileImage
);

module.exports = router;
