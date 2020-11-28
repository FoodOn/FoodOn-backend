const {uploadProduct} = require("../config/multer-product"),
  multer = require("multer");
module.exports.uploadImageProduct = (req, res, next) => {
  uploadProduct.single("image")(req, res, (err) => {
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
