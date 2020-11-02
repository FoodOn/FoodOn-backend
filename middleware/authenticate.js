require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.isAuthenticated = async (req, res, next) => {
  const token = req.get("Authorization").split(" ")[1];
  try {
    if(token)
    {
      const decode = jwt.verify(token, process.env.SECRET);
      if(!decode)
      {
          const err=new Error("Not authenticated");
          err.status=401;
          throw err;
      }
      req.userId = decode.id;
      next();
    }
    else{
      const err=new Error("Not authenticated");
      err.status=401;
      throw err;
    }

  } catch (err) {
    if (err.status == undefined) {
      err.status = 500;
      err.message = "Something went wrong";
    }
    return next(err);
  }
};
