const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: String,
      trim: true,
      required: true,
    },
    availability: {
      type: Boolean,
      default: false,
    },
    image: {
      location: { type: String, required: true },
      size: { type: Number, required: true },
      originalName: { type: String, required: true },
      key: { type: String, required: true },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      trim: true,
      lowercase: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

var autopopulate = function (next) {
  this.populate("user");
  next();
};
productSchema
  .pre("findOne", autopopulate)
  .pre("find", autopopulate)
  .pre("findOneAndUpdate", autopopulate);

module.exports.Product = mongoose.model("Product", productSchema);
module.exports.productSchema = productSchema;
