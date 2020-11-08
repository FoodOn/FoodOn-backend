require("dotenv").config();

const aws = require("aws-sdk"),
  s3 = new aws.S3({
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    accessKeyId: process.env.ACCESS_KEY_ID,
  });

module.exports.deleteImageFromAws = (key, cb) => {
  const params = {
    Bucket: "homemake",
    Key: key,
  };
  s3.deleteObject(params, cb);
};
