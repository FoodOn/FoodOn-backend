require("dotenv").config();
const aws = require("aws-sdk"),
  multer = require("multer"),
  multerS3 = require("multer-s3"),
  { v4 } = require("uuid");

// image config
aws.config.update({
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  accessKeyId: process.env.ACCESS_KEY_ID,
  region: "ap-south-1",
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
  let { name, description, price, quantity, category } = req.body;
  name = name.trim();
  description = description.trim();
  price = price.trim();
  quantity = quantity.trim();
  category = category.trim();
  if (
    name == "" ||
    description == "" ||
    price == "" ||
    quantity == "" ||
    category == ""
  ) {
    cb(new Error("Fill all the input fields"), false);
  } else {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      if (req.product) {
        console.log(req.product.image.originalName);
        console.log(file.originalname);
        if (req.product.image.originalName == file.originalname) {
          req.imageUpdate = false;
          return cb(null, false);
        } else {
          req.imageUpdate = true;
        }
      }
      return cb(null, true);
    } else {
      cb(new Error("Invalid mimetype,only JPEG,PNG and JPG"), false);
    }
  }
};

const upload = multer({
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: fileFilter,
  storage: multerS3({
    s3: s3,
    bucket: "homemake",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "homemaker-image-upload" });
    },
    key: function (req, file, cb) {
      cb(null, v4());
    },
  }),
});

module.exports = upload;
