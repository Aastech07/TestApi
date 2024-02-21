const express = require("express");
const router = express.Router();
const shopOfficeController = require("../controller/shopOfficeController");
const multer = require("multer");
const uploadMultipleImage = multer({ dest: "uploads/" });

router.get("/shopOffices", shopOfficeController.getAllShopOffices);
router.get("/shopOffices/:id", shopOfficeController.getShopOfficeById);
router.post("/shopOffices", shopOfficeController.createShopOffice);
router.put("/shopOffices/:id", shopOfficeController.updateShopOffice);
router.delete("/shopOffices/:id", shopOfficeController.deleteShopOffice);
router.post(
  "/shopOffices/:id",
  uploadMultipleImage.array("image"),
  shopOfficeController.uploadshopOfficeImages
);

module.exports = router;
