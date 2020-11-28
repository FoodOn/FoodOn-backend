const { deleteImageFromAws } = require("../config/deleteImageFromAws");
const User = require("../models/user"),
  _ = require("lodash"),
  { productDelete } = require("../util/productDelete");
Cart = require("../models/cart");
Product = require("../models/product");
const { isLength24 } = require("../util/general");

//Controllers
module.exports = {
  updateUser: async (req, res, next) => {
    try {
      let user = req.profile;
      const copyUser = { ...user._doc };
      const key = copyUser.image.key;
      user = _.extend(user, req.body);
      if (req.userImageUpdate && req.file) {
        user.image.location = req.file.location;
        user.image.size = req.file.size;
        user.image.originalName = req.file.originalname;
        user.image.key = req.file.key;
      }
      const saveUser = await user.save();
      if (!saveUser) {
        const err = new Error("User not saved");
        err.status = 400;
        throw err;
      }
      if (req.userImageUpdate && req.file) {
        deleteImageFromAws(key, (err, data) => {
          if (err) {
            const err = new Error(
              `Image is not deleted from AWS, the image key is ${image.key}`
            );
            err.status = 500;
            throw err;
          }
          return res.json({
            message: "User successfully updated",
          });
        });
      } else {
        return res.json({
          message: "User successfully updated",
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

  deleteUser: async (req, res, next) => {
    deleteImageFromAws(req.profile.image.key, async () => {
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
    });
  },

  getSpecifiedUser: (req, res, next) => {
    req.profile.userProduct = undefined;
    req.profile.password = undefined;
    res.json({
      user: req.profile,
    });
  },

  // Cart
  getCartProducts: async (req, res, next) => {
    try {
      // var newItem
      // newItem=_.clone(req.profile.cartItems, true);
      // req.profile.cartItems=[]
      // req.profile.cartItems=_.clone(newItem,true)
      // if(!await req.profile.save())
      // {
      //   throw err
      // }
      let products = req.profile.cartItems;
      let deleteCartsId = req.profile.cartItems
        .filter((cart) => cart.product === null)
        .map((cart) => cart._id);
      if (deleteCartsId.length != 0) {
        const deleteCarts = await Cart.deleteMany({
          _id: { $in: deleteCartsId },
        });
        if (
          deleteCarts.deletedCount == 0 &&
          deleteCarts.deletedCount != deleteCarts.n
        ) {
          const err = new Error("Carts not deleted");
          err.status = 500;
          throw err;
        }
        products = req.profile.cartItems.filter(
          (cart) => cart.product !== null
        );
        let updateCartsId = products.map((cart) => cart._id);
        req.profile.cartItems = updateCartsId;
        const saveUser = req.profile.save();
        if (!saveUser) {
          const err = new Error("User not saved");
          err.status = 400;
          throw err;
        }
      }
      return res.json({
        cart: products,
      });
    } catch (err) {
      if (err.status == undefined) {
        err.status = 500;
        err.message = "Something went wrong";
      }
      return next(err);
    }
  },

  addProductInCart: async (req, res, next) => {
    try {
      const { productId, quantity } = req.body;

      // TODO check id length it is optional feature
      isLength24(productId);
      // TODO add a logic to verify the product id is right
      const product = await Product.findById(productId);
      if (!product) {
        const err = new Error("Product not found");
        err.status = 400;
        throw err;
      }
      var user = req.profile;
      let bool = user.verifyThatProductIsAlreadyInCart(productId);
      if (bool) {
        return res
          .status(400)
          .json({ message: "Product is already added in cart" });
      }
      // store it in cart first
      var newCart = await new Cart({
        quantity,
        product: productId,
      }).save();

      if (!newCart) {
        const err = new Error("Product not saved in cart");
        err.status = 400;
        throw err;
      }
      user.cartItems.push(newCart._id);
      newCart = await user.save();
      if (!newCart) {
        const err = new Error("Product not saved in cart(user collection)");
        err.status = 400;
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
      // to check length of cart
      req.profile.cartLength();
      // to verify the quantity
      var bool = req.profile.verifyQuantity(
        req.params.state,
        req.params.cartId
      );
      if (bool) {
        let data = await Cart.findByIdAndDelete(req.params.cartId);
        if (!data) {
          const err = new Error("Cart item cannot deleted may be id is wrong");
          err.status = 400;
          throw err;
        }
        return res.json({ message: "cart item deleted" });
      }
      const updatedData = await Cart.findOneAndUpdate(
        {
          _id: req.params.cartId,
        },
        {
          $inc: { quantity: req.params.state },
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
      // if cart length is zero
      req.profile.cartLength();
      const { cartId } = req.body;
      let newCart = await Cart.findByIdAndDelete(cartId);

      if (!newCart) {
        const err = new Error("Cannot Delete product from cart");
        err.status = 400;
        throw err;
      }
      return res.json({ message: "Product deleted" });
    } catch (error) {
      if (error.status == undefined) {
        error.status = 500;
        error.message = "Something went wrong";
      }
      return next(error);
    }
  },
  removeAll: async (req, res, next) => {
    try {
      // store the id of cart
      var cartId = [];
      cartId = req.profile.cartItems.map(function (cart) {
        return cart._id;
      });
      // empty the customer cart
      req.profile.cartItems = [];
      if (!(await req.profile.save())) {
        const err = new Error("Cannot delete all product/s from cart");
        err.status = 400;
        throw err;
      }
      // delete the cart documents
      var data = await Cart.deleteMany({ _id: { $in: cartId } });
      if (!data) {
        const err = new Error("Cannot delete all product/s from cart");
        err.status = 400;
        throw err;
      }
      return res.json({ message: "All product from cart are removed" });
    } catch (error) {
      if (error.status == undefined) {
        error.status = 500;
        error.message = "Something went wrong";
      }
      return next(error);
    }
  },
};
