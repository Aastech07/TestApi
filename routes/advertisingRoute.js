const express = require('express');
const router = express.Router();
const advertisingController = require('../controller/advetisingController');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// Routes
router.get('/advertisements/search', advertisingController.searchAdvertising);
router.get('/advertisements', advertisingController.getAllAdvertisements);
router.get('/advertisements/:id', advertisingController.getAdvertisementById);
router.post('/advertisements', advertisingController.addAdvertisement);
router.put('/advertisements/:id', advertisingController.updateAdvertisement);
router.delete('/advertisements/:id', advertisingController.deleteAdvertisement);

router.post(
    "/uploadImage/advertisements/:id",
    upload.single("image"),
    advertisingController.uploadAdvertisingImage
  );
module.exports = router;
