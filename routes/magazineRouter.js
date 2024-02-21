const express = require("express");
const router = express.Router();
const magazineController = require("../controller/magazineController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/magazines", magazineController.getAllMagazines);

router.post("/magazines", magazineController.createMagazine);
router.delete("/magazines/:id", magazineController.deleteMagazine);
router.post(
  "/uploadpdf/magazines/:id",
  upload.single("image"),
  magazineController.uploadMagazinepdf
);
module.exports = router;
