const Product = require("../models/product");

module.exports.getProduct = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id).populate("user");
    if (!product) {
      const err = new Error("Product not found");
      err.status = 400;
      throw err;
    }
    req.product = product;
    next();
  } catch (err) {
    if (err.status == undefined) {
      err.status = 500;
      err.message = "Something went wrong";
    }
    return next(err);
  }
};
