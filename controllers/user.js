const User = require("../models/user"),
  _ = require("lodash"),
  { productDelete } = require("../util/productDelete");

//Controllers
module.exports = {
  updateUser: async (req, res, next) => {
    try {
      let user = req.profile;
      user = _.extend(user, req.body);
      const saveUser = await user.save();
      if (!saveUser) {
        const err = new Error("User not saved");
        err.status = 400;
        throw err;
      }
      return res.json({
        message: "User successfully updated",
      });
    } catch (err) {
      if (err.status == undefined) {
        err.status = 500;
        err.message = "Something went wrong";
      }
      return next(err);
    }
  },

  deleteUser: async (req, res, next) => {
    const user = req.profile;
    const userProduct = [...user.userProduct];
    try {
      for (let product of userProduct) {
        let key = product.image.key;
        let id = product._id;
        await productDelete(user, key, id, next);
      }
      const deleteUser = await User.findByIdAndDelete(req.params.userId);
      if (!deleteUser) {
        const err = new Error("User not deleted");
        err.status = 400;
        throw err;
      }
      return res.json({
        message: "User successfully deleted",
      });
    } catch (err) {
      if (err.status == undefined) {
        err.status = 500;
        err.message = "Something went wrong";
      }
      return next(err);
    }
  },

  getSpecifiedUser: (req, res, next) => {
    req.profile.userProduct = undefined;
    req.profile.password = undefined;
    res.json({
      user: req.profile,
    });
  },

  getCartProducts: (req, res, next) => {
    return res.json({
      cart: req.profile.cart,
    });
  },

  addProductInCart: async (req, res, next) => {
    try {
      let user = req.profile;
      const { productId, quantity } = req.body;
      let bool = user.verifyThatProductIsAlreadyInCart(productId);
      if (bool) {
        return res
          .status(400)
          .json({ message: "Product is already added in cart" });
      }
      user.cart.push({
        product: productId,
        quantity,
      });
      const newCart = await user.save();
      if (!newCart) {
        const err = new Error("Product cannot be saved in cart");
        err.status = 500;
        throw err;
      }
      return res.json({ message: "Product saved" });
    } catch (err) {
      if (err.status == undefined) {
        err.status = 500;
        err.message = "Something went wrong";
      }
      return next(err);
    }
  },

  incrementDecrementItem: async (req, res, next) => {
    try {
      req.profile.cartLength();
      const updatedData = await User.findOneAndUpdate(
        {
          _id: req.params.userId,
          "cart._id": req.params.cartId,
        },
        {
          $inc: { "cart.$.quantity": req.params.state },
        },
        { new: true, useFindAndModify: false }
      );
      if (!updatedData) {
        const err = new Error("Cannot Increment quantity");
        err.status = 400;
        throw err;
      }
      return res.json({ message: "Success" });
    } catch (error) {
      if (error.status == undefined) {
        error.status = 500;
        error.message = "Something went wrong";
      }
      return next(error);
    }
  },

  deleteProductFromCart: async (req, res, next) => {
    try {
      //   get id of cart obj
      // get id of product
      req.profile.cartLength();

      let newCart = await User.findOneAndUpdate(
        { _id: req.params.userId },
        {
          $pull: {
            cart: { _id: req.params.cartId },
          },
        },
        { new: true, useFindAndModify: false }
      );
      if (!newCart) {
        const err = new Error("Cannot Delete product from cart");
        err.status = 400;
        throw err;
      }
      return res.json({ message: "Product deleted" });
    } catch (error) {
      console.log(error);
      if (error.status == undefined) {
        error.status = 500;
        error.message = "Something went wrong";
      }
      return next(error);
    }
  },
};
