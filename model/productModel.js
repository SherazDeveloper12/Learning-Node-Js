const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    price: Number,
    category: String,
});
const Product = mongoose.model('Product', productSchema);
module.exports = { Product };