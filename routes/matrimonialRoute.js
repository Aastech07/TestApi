const express = require("express");
const router = express.Router();
const matrimonialController = require("../controller/matrimonialController");
const multer = require("multer");
const uploadMultipleImage = multer({ dest: "uploads/" });

const { authmiddleware, AproveAdmin } = require("../middleware/authmiddleware");

// Routes
router.get("/matrimonial/profiles", matrimonialController.getAllProfiles);
router.get("/matrimonial/profiles/:id", matrimonialController.getProfileById);
router.post("/matrimonial/profiles", matrimonialController.addProfile);
router.put("/matrimonial/profiles/:id", matrimonialController.updateProfile);
router.delete("/matrimonial/profiles/:id", matrimonialController.deleteProfile);
router.put(
  "/matrimonial/approve/:matrimonialId",
  authmiddleware,
  AproveAdmin,
  matrimonialController.approveMatrimonial
);

router.post(
  "/uploadImage/matrimonial/profiles/:id",
  uploadMultipleImage.array("image"),
  matrimonialController.uploadMatrimonialProfileImage
);

module.exports = router;
