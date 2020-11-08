require("dotenv").config();

const Product = require("../models/product"),
  { deleteImageFromAws } = require("../config/deleteImageFromAws"),
  _ = require("lodash");

//Controllers
module.exports.createProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      const err = new Error("Image is not provided");
      err.status = 422;
      throw err;
    }
    const product = new Product(req.body);
    product.image.location = req.file.location;
    product.image.size = req.file.size;
    product.image.originalName = req.file.originalname;
    product.image.key = req.file.key;
    product.city = req.profile.city;
    const saveProduct = await product.save();
    if (!saveProduct) {
      const err = new Error("Product not saved");
      err.status = 400;
      throw err;
    }
    const user = req.profile;
    user.userProduct.push(saveProduct._id);
    const saveUser = await user.save();
    if (!saveUser) {
      const err = new Error("User not saved");
      err.status = 400;
      throw err;
    }
    saveProduct.user = saveUser._id;
    const againSaveProduct = await saveProduct.save();
    if (!againSaveProduct) {
      const err = new Error("Product not saved");
      err.status = 400;
      throw err;
    }
    againSaveProduct.user = undefined;
    return res.status(201).json({
      message: "Product create successfuly",
      product: againSaveProduct,
    });
  } catch (err) {
    if (err.status == undefined) {
      err.status = 500;
      err.message = "Something went wrong";
    }
    return next(err);
  }
};

module.exports.updateProduct = async (req, res, next) => {
  try {
    let product = req.product;
    const { image } = product;
    product = _.extend(product, req.body);
    if (req.imageUpdate) {
      product.image.location = req.file.location;
      product.image.size = req.file.size;
      product.image.originalName = req.file.originalname;
      product.image.key = req.file.key;
    }
    const saveProduct = await product.save();
    if (!saveProduct) {
      const err = new Error("Product not saved");
      err.status = 400;
      throw err;
    }
    if (req.imageUpdate) {
      deleteImageFromAws(image.key, (err, data) => {
        if (err) {
          const err = new Error(
            `Image is not deleted from AWS, the image key is ${image.key}`
          );
          err.status = 500;
          throw err;
        }
        return res.json({
          message: "Product successfully updated",
        });
      });
    } else {
      return res.json({
        message: "Product successfully updated",
      });
    }
  } catch (err) {
    if (err.status == undefined) {
      err.status = 500;
      err.message = "Something went wrong";
    }
    return next(err);
  }
};

module.exports.deleteProduct = async (req, res, next) => {
  deleteImageFromAws(req.product.image.key, async (err, data) => {
    try {
      if (err) {
        const err = new Error(
          `Image is not deleted from AWS, the image key is ${req.product.image.key}`
        );
        err.status = 500;
        throw err;
      }
      const product = await Product.findByIdAndDelete(req.params.productId);
      if (!product) {
        const err = new Error("Product not deleted");
        err.status = 400;
        throw err;
      }
      const user = req.profile;
      user.userProduct.pull({ _id: req.params.productId });
      const saveUser = await user.save();
      if (!saveUser) {
        const err = new Error("Product not deleted form user");
        err.status = 400;
        throw err;
      }
      return res.json({
        message: "Product successfully deleted",
      });
    } catch (err) {
      if (err.status == undefined) {
        err.status = 500;
        err.message = "Something went wrong";
      }
      return next(err);
    }
  });
};

module.exports.getProductsByQuery = async (req, res, next) => {
  let option = {};
  if (req.query.id) {
    option = { _id: req.query.id };
  }
  if (req.query.city) {
    option = { city: req.query.city };
  }
  if (req.query.category) {
    option = { category: req.query.category };
  }

  try {
    const products = await Product.find(option).populate(
      "user",
      "-password -userProduct"
    );
    if (products.length == 0) {
      const err = new Error("No products found");
      err.status = 404;
      throw err;
    }
    return res.json({
      products: products,
    });
  } catch (err) {
    if (err.status == undefined) {
      err.status = 500;
      err.message = "Something went wrong";
    }
    return next(err);
  }
};

module.exports.getUserProducts = (req, res, next) => {
  if (req.profile.userProduct.length == 0) {
    return res.json({
      message: "User not uplaoded any product",
    });
  }
  return res.json({
    userProduct: req.profile.userProduct,
  });
};

module.exports.changeAvailability = async (req, res, next) => {
  const product = req.product;
  product.availability = !product.availability;
  const saveProduct = await product.save();
  if (!saveProduct) {
    const err = new Error("Product not saved");
    err.status = 400;
    throw err;
  }
  return res.json({
    message: "Product availability successfully changed",
  });
};
