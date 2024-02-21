const express = require('express');
const router = express.Router();
const newsController = require('../controller/newsController');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post('/news', newsController.addNews);
router.get('/news/search', newsController.searchNewsByTitle); 
router.get('/news', newsController.getAllNews);
router.get('/news/:id', newsController.getNewsById);
router.put('/news/:id', newsController.updateNews);
router.delete('/news/:id', newsController.deleteNews);
router.post(
    "/uploadImage/news/:id",
    upload.single("image"),
    newsController.uploadNewsImage
  );
module.exports = router;
