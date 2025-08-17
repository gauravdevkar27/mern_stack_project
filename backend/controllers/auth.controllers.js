const User = require('../models/user.models.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Custom async handler to replace express-async-handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const secretKey = process.env.JWT_SECRET;

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, userName, passWord } = req.body;

  if (!userName || !passWord) {
    res.status(400);
    throw new Error('Please provide a username and password');
  }

  const duplicate = await User.findOne({ userName });
  if (duplicate) {
    res.status(400);
    throw new Error('User already registered with this username');
  }

  const user = new User({ firstName, lastName, userName, passWord });
  const result = await user.save();

  if (result) {
    res.status(201).json({ message: 'User registered successfully!' });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, passWord } = req.body;
  const user = await User.findOne({ userName });

  if (user && (await user.comparePassword(passWord))) {
    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    const finalData = {
      userId: user._id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      token: token,
    };

    res.status(200).json(finalData);
  } else {
    res.status(401); // Use 401 Unauthorized for login failures
    throw new Error('Invalid username or password');
  }
});

const AuthController = {
    registerUser,
    loginUser
} 

module.exports = AuthController;