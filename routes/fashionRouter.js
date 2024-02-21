const express = require("express");
const router = express.Router();
const fashionController = require("../controller/fashionController");
const multer = require("multer");
const uploadMultipleImage = multer({ dest: "uploads/" });

router.get("/fashion", fashionController.getAllFashion);
router.get("/fashion/:id", fashionController.getFashionById);
router.post("/fashion", fashionController.createFashion);
router.put("/fashion/:id", fashionController.updateFashion);
router.delete("/fashion/:id", fashionController.deleteFashion);

router.post(
  "/fashion/:id",
  uploadMultipleImage.array("image"),
  fashionController.uploadFashionImages
);

module.exports = router;
