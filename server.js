require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

// Middleware
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
    name: String,
    price: Number
});
const Product = mongoose.model('Product', productSchema);

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    age: {
        type: Number,
        min: 0
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/products', (req, res) => {
    const products = [
        { id: 1, name: 'Laptop', price: 999.99 },
        { id: 2, name: 'Smartphone', price: 499.99 },
        { id: 3, name: 'Tablet', price: 299.99 }
    ];
    res.json(products);
});

app.post('/products/create', async (req, res) => {
    try {
        const newProduct = new Product({
            name: req.body.name,
            price: req.body.price
        });
        const saved = await newProduct.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});