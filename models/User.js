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
  userProduct: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity:{
        type:Number,
        default:1
      }
    }
  ],
});

userSchema.methods={
  verifyThatProductIsAlreadyInCart:function (productId)
  {
      for (const ins of this.cart) {
        if(ins.product._id==productId)
        {
            
            return true
        }
      }
      return false
  },
  cartLength:function()
  {
    
    if(this.cart.length==0)
    {
      const err = new Error("no products in cart");
            err.status = 400;
            throw err; 
    }
  }
}

module.exports = mongoose.model("User", userSchema);
