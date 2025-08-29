const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controllers.js');
const PasswordAuthController = require('../controllers/PasswordAuth.controllers.js');

// Authentication routes
router.post('/register', AuthController.registerUser);
router.post('/login', AuthController.loginUser);

// Password reset routes
router.post('/forgot-password', PasswordAuthController.requestPasswordReset);
router.get('/reset-password/:token', PasswordAuthController.verifyResetToken);
router.post('/reset-password', PasswordAuthController.resetPassword);

module.exports = router;