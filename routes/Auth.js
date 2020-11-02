const express = require("express"),
  { body } = require("express-validator"),
  User = require("../models/User"),
  bcrypt = require("bcrypt"),
  router = express.Router(),
  { signup, signin, signout } = require("../controller/Auth"),
  { isAuthenticated } = require("../middleware/authenticate");

router.post(
  "/signup",
  [
    body("name", "Fill all input fields").trim().notEmpty(),
    body("lastName", "Fill all input fields").trim().notEmpty(),
    body("password")
      .notEmpty()
      .withMessage("Fill all input fields")
      .isLength({ min: 6 })
      .withMessage("Password should contain minimum 6 character"),
    body("address", "Fill all input fields").trim().notEmpty(),
    body("contact")
      .notEmpty()
      .withMessage("Fill all input fields")
      .isLength({ max: 10, min: 10 })
      .withMessage("Enter valid contact number"),
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Enter a valid email")
      .custom(async (email, { req }) => {
        const user = await User.findOne({ email: email });
        if (user) {
          const err = new Error("Email is already existed,please sign in");
          err.status = 422;
          throw err;
        }
        return true;
      }),
  ],
  signup
);

router.post(
  "/signin",
  [
    body("email")
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage("Enter a valid email")
      .custom(async (email, { req }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
          const err = new Error("Email is not available, please signup");
          err.status = 422;
          throw err;
        }
        if (req.body.password == "" || req.body.password == undefined) {
          const err = new Error("Fill all input fields");
          err.status = 422;
          throw err;
        }
        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result) {
          const err = new Error("Password is incorrect");
          err.status = 422;
          throw err;
        }
        return true;
      }),
  ],
  signin
);

router.get("/signout", isAuthenticated, signout);

module.exports = router;
