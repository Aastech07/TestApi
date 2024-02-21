const multer = require("multer");
const multerS3 = require("multer-s3");
const shortid = require("shortid");
const Cloud = require("./aws-sdk");
const path = require("path");

console.log("Cloud.s3", Cloud.s3);
const config = {
  storage: multerS3({
    s3: Cloud.s3,
    bucket: process.env.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const prefixPath = req.prefixPath || "";
      const f =
        Date.now().toString() +
        "_" +
        shortid.generate() +
        path.extname(file.originalname);
      cb(
        null,
        path.format({
          root: prefixPath,
          base: f,
          ext: "ignored",
        })
      );
    },
  }),
};

const Imageconfig = {
  storage: multerS3({
    s3: Cloud.s3,
    bucket: process.env.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const prefixPath = req.prefixPath || "";
      const fileName =
        Date.now().toString() +
        "_" +
        shortid.generate() +
        path.extname(file.originalname);
      const filePath = path.format({
        root: prefixPath,
        base: fileName,
        ext: "ignored",
      });
      if (!req.filePaths) {
        req.filePaths = [];
      }
      req.filePaths.push(filePath);

      cb(null, filePath);
    },
  }),
};
const upload = multer(config);
const uploadMultipleImage = multer(Imageconfig);

module.exports = {
  upload,
  uploadMultipleImage,
};
