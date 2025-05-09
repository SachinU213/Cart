const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: String,
  quantity: Number,
  price: Number
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [itemSchema],
  totalPrice: Number,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
