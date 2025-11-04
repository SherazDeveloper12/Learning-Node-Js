require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
async function main() {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('MONGO_URI is not set. Create a .env file with MONGO_URI in the project root.');
            process.exit(1);
        }
        await mongoose.connect(uri);
        console.log('Connected to MongoDB Atlas!');
    } catch (error) {
        console.error('Connection failed:', error.message);
        process.exit(1);
    }
}
main();

// Product Schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    price: Number,
    category: String,
});
const Product = mongoose.model('Product', productSchema);


// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});


// ==================== Product CRUD ROUTES ====================
app.post('/products/create', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const saved = await newProduct.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(402).json({ message: err.message });
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/products/update/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/products/delete/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        res.json(deletedProduct);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});