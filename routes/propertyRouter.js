const express = require("express");
const router = express.Router();
const propertyController = require("../controller/propertyController");
const multer = require("multer");
const uploadMultipleImage = multer({ dest: "uploads/" });

router.post("/properties", propertyController.createProperty);
router.get("/properties", propertyController.getAllProperties);
router.get("/properties/:id", propertyController.getPropertyById);
router.put("/properties/:id", propertyController.updateProperty);
router.delete("/properties/:id", propertyController.deleteProperty);

router.post(
  "/propertiesImagess/:id",
  uploadMultipleImage.array("image"),
  propertyController.uploadPropertyImages
);

module.exports = router;
