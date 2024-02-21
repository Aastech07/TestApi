const express = require("express");
const router = express.Router();
const announcementCategoryController = require("../controller/announcementCategoryController");


router.post("/announcement-categories", announcementCategoryController.createAnnouncementCategory);

router.get("/announcement-categories", announcementCategoryController.getAllAnnouncementCategories);

router.get("/announcement-categories/:id", announcementCategoryController.getAnnouncementCategoryById);

router.put("/announcement-categories/:id", announcementCategoryController.updateAnnouncementCategoryById);

router.delete("/announcement-categories/:id", announcementCategoryController.deleteAnnouncementCategoryById);

module.exports = router;
