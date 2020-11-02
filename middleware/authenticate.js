require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.isAuthenticated = async (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  try {
    const decode = await jwt.verify(token, process.env.SECRET);
    if(!decode)
    {
        const err=new Error("Not authenticated");
        err.status=401;
        throw err;
    }
    req.userId = decode.id;
    next();
  } catch (err) {
    if (err.status == undefined) {
      err.status = 500;
      err.message = "Something went wrong";
    }
    return next(err);
  }
};
