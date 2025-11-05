const { createProduct, updateProduct, fetchAllProducts, deleteProduct, fetchProductById } = require("../controller/productsController");
const { authverify } = require("../middleware/auth");
const express = require("express");
const productsRouter = express.Router();

productsRouter.post('/create', createProduct);

productsRouter.get('/', authverify, fetchAllProducts);

productsRouter.put('/update/:id', updateProduct);

productsRouter.delete('/delete/:id', deleteProduct);

productsRouter.get('/:id', fetchProductById);
module.exports = productsRouter;