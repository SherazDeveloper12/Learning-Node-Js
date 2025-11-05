const { doSignUp, doLogin, fetchAllUsers, updateUser, deleteUser } = require("../controller/authcontrollers");
const express = require('express');
const authrouter = express.Router();
authrouter.post('/signup', doSignUp )

authrouter.post('/users/login', doLogin);

authrouter.get('/users', fetchAllUsers);

authrouter.put('/users/update/:id', updateUser);
authrouter.delete('/users/delete/:id', deleteUser);
module.exports = authrouter;