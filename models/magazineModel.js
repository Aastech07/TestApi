const mongoose = require("mongoose");

const mgazineSchem = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  date: { type: String, required: true },
});

const Magazine = mongoose.model("Magazine", mgazineSchem);

module.exports = Magazine;
