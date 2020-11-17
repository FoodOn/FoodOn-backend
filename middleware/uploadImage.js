const upload = require("../config/multer"),
  multer = require("multer");
module.exports.uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    const now = err && err.code == "UnknownEndpoint" ? true : false;
    // internet disconnect
    if (now) {
      const err = new Error("Internet disconnected");
      err.status = 500;
      return next(err);
    }
    // multer error
    if (err || err instanceof multer.MulterError) {
      err.status = 422;
      return next(err);
    }

    return next();
  });
};
