require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authverify = (req, res, next) => {
   try {
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Login Required' });
    }
    const decoded = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
    if (!decoded) {
        return res.status(401).json({ message: 'Login Required' });
    }
    console.log('Decoded JWT:', decoded);
    req.body.user = decoded;
    next();
    
   } catch (error) {
    res.status(401).json({ message: error.message });
   }
};
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
// user schema can be added here similarly
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        trim: true
    },
    email: { type: String, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    address: String,
    createdAt: { type: Date, default: Date.now }

});
const User = mongoose.model('User', userSchema);

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

app.get('/products', authverify, async (req, res) => {
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
// ==================== Users CRUD ROUTES ====================
// User routes can be added here similarly
app.post('/users/signup', async (req, res) => {
    try {
        if (!req.body.password) {
            return res.status(400).json({ message: 'Password is required' });
        }
        var hashedPassword =  bcrypt.hashSync(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            address: req.body.address
        });
        const saved = await newUser.save();
        console.log('User created:', saved);
        res.status(201).json(saved);
    } catch (err) {
        res.status(402).json({ message: err.message });
    }
});

app.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = bcrypt.compareSync(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        var token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        const loggedInUser = {
            token: token,
                id: user._id,
                username: user.username,
                email: user.email,
                address: user.address,
                createdAt: user.createdAt
            }
        res.json({ message: 'Login successful', loggedInUser });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/users/update/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                username: req.body.username,
                email: req.body.email,
                address: req.body.address,
                password: req.body.password ? bcrypt.hashSync(req.body.password, 10) : undefined
            },
            { new: true }
        );
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.delete('/users/delete/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});