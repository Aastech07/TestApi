const express = require("express");
const router = express.Router();
const galleryController = require("../controller/galleryController");
const multer = require("multer");
const uploadMultipleImage = multer({ dest: "uploads/" });

router.get("/gallery", galleryController.getAllGalleries);
router.get("/gallery/:id", galleryController.getGalleryById);
router.post("/gallery", galleryController.createGallery);
router.put("/gallery/:id", galleryController.updateGallery);
router.delete("/gallery/:id", galleryController.deleteGallery);

router.post(
  "/gallery/image/:id",
  uploadMultipleImage.array("image"),
  galleryController.uploadGallerieImages
);
module.exports = router;
