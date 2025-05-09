const Cart = require('../models/Cart');

// Create Cart
exports.createCart = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "'items' should be an array." });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const cart = new Cart({ userId, items, totalPrice });
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get Cart by User ID
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Cart
exports.updateCart = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "'items' should be an array." });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const cart = await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { items, totalPrice, updatedAt: Date.now() },
      { new: true, upsert: true }
    );
    res.json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Cart
exports.deleteCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ message: 'Cart deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
