module.exports.checkForConnectivity = (req, res, next) => {
    require("dns").lookup("google.com", function (err) {
    if (err && err.code == "ENOTFOUND") {
      const error = new Error(
        "Internet is not connected, Check your internet connectivity"
      );
      error.status = 403;
      return next(error);
    } else {
      next();
    }
  });
};
