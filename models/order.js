const mongoose = require("mongoose"),
  { productSchema } = require("./product");
var cartSchema = new mongoose.Schema({
  quantity: Number,
  product:productSchema,
  customerId: String,
  cheifId:String,
  note:String
});

var orderSchema = new mongoose.Schema({
  Item: cartSchema,
  transactionId: {
    type: String,
    default: null,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Paied", "Processing", "Tracking", "Deleivered","Cancel"],
    default: "Pending",
  },
  trackingStatus: {
    type: String,
    trim: true,
  },
  cheifId:String,
  userId:String,
  address:String
});

module.exports = mongoose.model("Order", orderSchema);

