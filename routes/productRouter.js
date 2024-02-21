const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadMultipleImage = multer({ dest: "uploads/" });
const {
  uploadCarImages,
  uploadBikeImages,
  uploadBicyclesImages,
  uploadTabletsImages,
  uploadAccessoriesImages,
  uploadPhoneImages,
  createPhone,
  createAccessories,
  createTablets,
  createBicycles,
  createBike,
  createCar,
  getAllPhones,
  getAllAccessories,
  getAllTablets,
  getAllBicycles,
  getAllBikes,
  getAllCars,
  getPhoneById,
  getAccessoriesById,
  getTabletsById,
  getBicyclesById,
  getBikeById,
  getCarById,
  updatePhone,
  updateAccessories,
  updateTablets,
  updateBicycles,
  updateBike,
  updateCar,
  deletePhone,
  deleteAccessories,
  deleteTablets,
  deleteBicycles,
  deleteBike,
  deleteCar,
} = require("../controller/productController");

router.post("/phones", createPhone);
router.get("/phones", getAllPhones);
router.get("/phones/:id", getPhoneById);
router.put("/phones/:id", updatePhone);
router.delete("/phones/:id", deletePhone);
router.post(
  "/phonesImage/:id",
  uploadMultipleImage.array("image"),
  uploadPhoneImages
);

router.post("/accessories", createAccessories);
router.get("/accessories", getAllAccessories);
router.get("/accessories/:id", getAccessoriesById);
router.put("/accessories/:id", updateAccessories);
router.delete("/accessories/:id", deleteAccessories);
router.post(
  "/accessoriesImage/:id",
  uploadMultipleImage.array("image"),
  uploadAccessoriesImages
);

router.post("/tablets", createTablets);
router.get("/tablets", getAllTablets);
router.get("/tablets/:id", getTabletsById);
router.put("/tablets/:id", updateTablets);
router.delete("/tablets/:id", deleteTablets);
router.post(
  "/tabletsImage/:id",
  uploadMultipleImage.array("image"),
  uploadTabletsImages
);

router.post("/bicycles", createBicycles);
router.get("/bicycles", getAllBicycles);
router.get("/bicycles/:id", getBicyclesById);
router.put("/bicycles/:id", updateBicycles);
router.delete("/bicycles/:id", deleteBicycles);
router.post(
  "/bicyclesImage/:id",
  uploadMultipleImage.array("image"),
  uploadBicyclesImages
);

router.post("/bikes", createBike);
router.get("/bikes", getAllBikes);
router.get("/bikes/:id", getBikeById);
router.put("/bikes/:id", updateBike);
router.delete("/bikes/:id", deleteBike);
router.post(
  "/bikesImage/:id",
  uploadMultipleImage.array("image"),
  uploadBikeImages
);

router.post("/cars", createCar);
router.get("/cars", getAllCars);
router.get("/cars/:id", getCarById);
router.put("/cars/:id", updateCar);
router.delete("/cars/:id", deleteCar);
router.post(
  "/carsImage/:id",
  uploadMultipleImage.array("image"),
  uploadCarImages
);

module.exports = router;
