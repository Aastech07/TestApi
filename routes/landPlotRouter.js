
const express = require("express");
const router = express.Router();
const landPlotController = require("../controller/landPlotController");
const multer = require("multer");
const uploadMultipleImage = multer({ dest: "uploads/" });

router.get("/landPlots", landPlotController.getAllLandPlots);
router.get("/landPlots/:id", landPlotController.getLandPlotById);
router.post("/landPlots/", landPlotController.createLandPlot);
router.put("/landPlots/:id", landPlotController.updateLandPlot);
router.delete("/landPlots/:id", landPlotController.deleteLandPlot);

router.post(
    "/landPlots/:id",
    uploadMultipleImage.array("image"),
    landPlotController.uploadLandPlotImages
  );

module.exports = router;
