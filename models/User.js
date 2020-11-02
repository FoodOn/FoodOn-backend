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
    lowercase: true,
    trim: true,
  },
  contact: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
