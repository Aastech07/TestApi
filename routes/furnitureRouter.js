const express = require("express");
const router = express.Router();
const furnitureController = require("../controller/furnitureController");
const multer = require("multer");
const uploadMultipleImage = multer({ dest: "uploads/" });

router.post("/furniture", furnitureController.createFurniture);
router.get("/furniture", furnitureController.getAllFurniture);
router.get("/furniture/:id", furnitureController.getFurnitureById);
router.put("/furniture/:id", furnitureController.updateFurniture);
router.delete("/furniture/:id", furnitureController.deleteFurniture);

router.post(
  "/furnitureImage/:id",
  uploadMultipleImage.array("image"),
  furnitureController.uploadFurnitureImages
);
module.exports = router;
