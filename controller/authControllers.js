const  bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../model/userModel');
const doSignUp = async (req, res) => {
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
};

const doLogin =  async (req, res) => {
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
};

const fetchAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
const updateUser = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        res.json(deletedUser);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { doSignUp, doLogin, fetchAllUsers, updateUser, deleteUser };