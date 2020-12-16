require("dotenv").config();

const {Product} = require("../models/product"),
  { deleteImageFromAws } = require("../config/deleteImageFromAws"),
  { productDelete } = require("../util/productDelete"),
  _ = require("lodash");
const User = require("../models/user");

//Controllers
module.exports = {
  createProduct: async (req, res, next) => {
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
      product.user = req.profile._id;
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
      saveProduct.user = undefined;
      return res.status(201).json({
        message: "Product create successfuly",
        product: saveProduct,
      });
    } catch (err) {
      if (err.status == undefined) {
        err.status = 500;
        err.message = "Something went wrong";
      }
      return next(err);
    }
  },

  updateProduct: async (req, res, next) => {
    try {
      let product = req.product;
      const copyProduct = { ...product._doc };
      const key = copyProduct.image.key;
      product = _.extend(product, req.body);
      if (req.imageUpdate && req.file) {
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
      if (req.imageUpdate && req.file) {
        deleteImageFromAws(key, (err, data) => {
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
  },

  deleteProduct: async (req, res, next) => {
    const key = req.product.image.key;
    const id = req.product._id;
    const profile = req.profile;
    try {
      const result = await productDelete(profile, key, id, next);
      if (result) {
        return res.json({
          message: "Product successfully deleted",
        });
      }
    } catch (err) {
      if (err.status == undefined) {
        err.status = 500;
        err.message = "Something went wrong";
      }
      return next(err);
    }
  },

  getProductsByQuery: async (req, res, next) => {
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
      let products = await Product.find(option).populate(
        "user",
        "-password -userProduct"
      );
      if (products.length == 0) {
        const err = new Error("No products found");
        err.status = 404;
        throw err;
      }
      if (
        req.query.userId != undefined &&
        req.query.userId != null &&
        req.query.userId != ""
      ) {
        products = products.filter((prod) => {
          return prod.user._id != req.query.userId;
        });
      }
      return res.json({
        products: products,
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

  getUserProducts: async (req, res, next) => {
    if (req.profile.userProduct.length == 0) {
      return res.json({
        message: "User not uplaoded any product",
      });
    }
    return res.json({
      userProduct: req.profile.userProduct,
    });
  },

  changeAvailability: async (req, res, next) => {
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
  },
};
