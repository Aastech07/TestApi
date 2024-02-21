const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { authmiddleware, isAdmin } = require("../middleware/authmiddleware");

// Routes
router.get("/blogs/search", blogController.searchBlogByTitle);
router.get("/blogs", blogController.getAllBlogs);
router.get("/blogs/:id", blogController.getBlogById);
router.post("/blogs", blogController.addBlog);
router.put("/blogs/:id", blogController.updateBlog);
router.delete("/blogs/:id", blogController.deleteBlog);

router.post(
  "/uploadImage/blogs/:id",
  upload.single("image"),
  blogController.uploadBlogImage
);

module.exports = router;
