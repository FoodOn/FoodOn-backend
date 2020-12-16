const mongoose = require("mongoose");
const { orderItemSchema } = require("./orderItem");
const orderSchema = new mongoose.Schema({
  orders: [orderItemSchema],
});

module.exports = mongoose.model("Order", orderSchema);
