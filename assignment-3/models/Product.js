const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  stock: { type: Number, default: 0 },
  image1: { type: String, required: false },
  image2: { type: String, required: false },
});

module.exports = mongoose.model("Product", productSchema);
