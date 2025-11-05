const mongoose = require('mongoose');
require('dotenv').config();
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
module.exports = { main };