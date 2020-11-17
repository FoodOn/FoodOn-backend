require("dotenv").config();
const User = require("../models/user"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  { validationResult } = require("express-validator");

//Controllers
module.exports = {
  signup: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 422;
        throw err;
      }
      req.body.otherAddress = req.body.otherAddress.trim();
      req.body.homeName = req.body.homeName.trim();
      if (req.body.otherAddress.length == 0) {
        req.body.otherAddress = "Nothing Mentioned";
      }
      if (req.body.homeName.length == 0) {
        req.body.homeName = "Nothing Mentioned";
      }
      const user = new User(req.body);
      const hash = await bcrypt.hash(req.body.password, 10);
      user.password = hash;
      const saveUser = await user.save();
      if (!saveUser) {
        const err = new Error("User not created");
        err.status = 422;
        throw err;
      }
      saveUser.password = undefined;
      return res.status(201).json({
        message: "User created succesfully",
        user: saveUser,
      });
    } catch (err) {
      console.log(err);
      if (err.status == undefined) {
        err.status = 500;
        err.message = "Something went wrong";
      }
      return next(err);
    }
  },

  signin: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 422;
        throw err;
      }
      const user = await User.findOne({ email: req.body.email });
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id.toString(),
        },
        process.env.SECRET,
        { expiresIn: "1h" }
      );
      return res.json({
        message: "User signin successfully",
        token: token,
      });
    } catch (err) {
      if (err.status == undefined) {
        err.status = 500;
        err.message = "Something went wrong";
      }
      return next(err);
    }
  },

  signout: (req, res, next) => {
    res.json({
      message: "Logout succesfully",
    });
  },
};
