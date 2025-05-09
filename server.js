const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const Product = require('./models/Product'); // Make sure this path is correct

dotenv.config();

const app = express(); // ✅ This must be before app.use() or app.post()

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI) // Fixed the variable name
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// TEMP: Add Product Route for Testing
app.post('/api/products/add', async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/products/:id/review', async (req, res) => {
    try {
        const { review, rating } = req.body;

        // Find the product by ID
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Add or update the review and rating
        product.reviews = product.reviews || [];
        product.reviews.push({ review, rating });
        product.averageRating =
            product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length;

        await product.save();
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



