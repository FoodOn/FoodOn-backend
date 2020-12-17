const User = require("../models/user");
const Cart = require("../models/cart");

module.exports.getUser = async (req, res, next, id) => {
  try {
    const user = await User.findById(id)
      .populate("userProduct")
      .populate({ path: "cartItems", populate: { path: "product" } })
      .populate("orders_as_user")
      .populate("orders_as_cheif")
    if (!user) {
      const err = new Error("User not found");
      err.status = 400;
      throw err;
    }
    req.profile = user;
    next();
  } catch (err) {
    console.log(err);
    if (err.status == undefined) {
      err.status = 500;
      err.message = "Something went wrong";
    }
    return next(err);
  }
};
