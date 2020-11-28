const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  localAddress: {
    type: String,
    required: true,
    trim: true,
  },
  otherAddress: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  areaCode: {
    type: Number,
    trim: true,
    required: true,
  },
  homeName: {
    type: String,
    trim: true,
  },
  contact: {
    type: String,
    required: true,
  },
  image: {
    location: { type: String, required: true },
    size: { type: Number, required: true },
    originalName: { type: String, required: true },
    key: { type: String, required: true },
  },
  userProduct: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  cartItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
  ],
});

userSchema.methods = {
  verifyThatProductIsAlreadyInCart: function (productId) {
    for (const ins of this.cartItems) {
      if (ins.product._id == productId) {
        return true;
      }
    }
    return false;
  },
  cartLength: function () {
    if (this.cartItems.length == 0) {
      const err = new Error("no products in cart");
      err.status = 400;
      throw err;
    }
  },
  verifyQuantity: function (state, id) {
    var num;
    for (const inc of this.cartItems) {
      if (inc._id == id) {
        num = Number(inc.quantity);
        state = Number(state);
        if (num + state === 0) {
          return true;
        }
      }
    }
    return false;
  },
};

module.exports = mongoose.model("User", userSchema);
