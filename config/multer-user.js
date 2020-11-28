require("dotenv").config();
const aws = require("aws-sdk"),
  multer = require("multer"),
  multerS3 = require("multer-s3"),
  { v4 } = require("uuid");

// image config
aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    if (req.profile) {
      if (file.originalname=== req.profile.image.originalName) {
        req.userImageUpdate = false;
        return cb(null, false);
      } else {
        req.userImageUpdate = true;
      }
    }
    return cb(null, true);
  } else {
    cb(new Error("Invalid mimetype,only JPEG,PNG and JPG"), false);
  }
};

const uploadUser = multer({
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_USER,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "home-user-image-image-upload" });
    },
    key: function (req, file, cb) {
      cb(null, v4());
    },
  }),
});

module.exports.uploadUser = uploadUser;
