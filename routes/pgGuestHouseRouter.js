const express = require("express");
const router = express.Router();
const pgGuestHouseController = require("../controller/pgGuestHouseController");
const multer = require("multer");
const uploadMultipleImage = multer({ dest: "uploads/" });

router.get("/pgGuestHouses", pgGuestHouseController.getAllPgGuestHouses);
router.get("/pgGuestHouses/:id", pgGuestHouseController.getPgGuestHouseById);
router.post("/pgGuestHouses", pgGuestHouseController.createPgGuestHouse);
router.put("/pgGuestHouses/:id", pgGuestHouseController.updatePgGuestHouse);
router.delete("/pgGuestHouses/:id", pgGuestHouseController.deletePgGuestHouse);
router.post(
  "/pgGuestHouses/:id",
  uploadMultipleImage.array("image"),
  pgGuestHouseController.uploadPgGuestHouseImages
);

module.exports = router;
