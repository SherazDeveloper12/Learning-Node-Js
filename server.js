
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const { main } = require('./config/db');
const authrouter = require('./routes/authRoutes');
const productsRouter = require('./routes/productsRoutes');


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// MongoDB Connection
 
main();
require('dotenv').config();

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// ==================== ROUTES ====================
app.use('/products', productsRouter);
app.use('/auth', authrouter);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});