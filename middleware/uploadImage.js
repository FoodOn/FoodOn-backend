const upload = require("../config/multer");
module.exports.uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    const now =(err && err.code=='UnknownEndpoint') ? true : false
    // internet disconnect
    if(now)
    {
      const err = new Error("Internet disconnected");
      err.status = 400;
      return next(err);
    }
    // multer error
    if ( err && err instanceof multer.MulterError) {
      const err = new Error("Error in image uploading");
      err.status = 400;
      return next(err);
    }
    // other errors
    if(err)
    {
      const err = new Error("Error in image uploading");
      err.status = 400;
      return next(err);
    }
    return next();
  });
};
