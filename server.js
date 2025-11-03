const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
// mongodb connection setup can be added here
const mongoose = require('mongoose');
const Cat = mongoose.model('Cat', { name: String });
// Middleware setup

app.use(bodyParser.json());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Sample route to test the server
// MongoDB connection

  async function main() {
    try {
        await mongoose.connect('mongodb+srv://sherazLearning:Ytguru@65@cluster0.umlgkew.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if connection fails
        
    }
  
}

main()
// define sceheme for products
const productSchema = new mongoose.Schema({
    name: String,
    price: Number
});

const Product = mongoose.model('Product', productSchema);

// sample routre to create a product
app.post('/products/create', async (req, res) => {
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message 

        });
    }
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/products', (req, res) => {
    let products = [
        { id: 1, name: 'Laptop', price: 999.99 },
        { id: 2, name: 'Smartphone', price: 499.99 },
        { id: 3, name: 'Tablet', price: 299.99 }
    ];
    res.json(products);
});
 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
