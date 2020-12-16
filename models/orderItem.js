const mongoose = require("mongoose"),
  { productSchema } = require("../models/product");
var cartSchema = new mongoose.Schema({
  quantity: Number,
  product:productSchema,
  customerId: String,
});

var orderItemSchema = new mongoose.Schema({
  Item: [cartSchema],
  transactionId: {
    type: String,
    default: null,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Payable", "Processing", "Tracking", "Deleivered"],
    default: "Pending",
  },
  trackingStatus: {
    type: String,
    trim: true,
  },

  cheifId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports.orderItem = mongoose.model("orderItem", orderItemSchema);
module.exports.orderItemSchema = orderItemSchema;
