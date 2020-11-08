const upload = require("../config/multer");
module.exports.uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      err.status = 422;
      return next(err);
    }
    return next();
  });
};
