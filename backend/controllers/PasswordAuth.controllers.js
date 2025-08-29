const User = require('../models/user.models.js');
const ResetPasswordToken = require('../models/Reset_Password.models.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Custom async handler
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Generate a random token
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Request Password Reset
const requestPasswordReset = asyncHandler(async (req, res) => {
    const { username } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const token = generateToken();

        // Save token to database
        const resetToken = new ResetPasswordToken({
            userId: user._id,
            token: token,
        });
        await resetToken.save();

        // Return token directly since we're not using email
        res.status(200).json({ 
            message: "Password reset token generated successfully",
            userId: user._id,
            resetToken: token,
            // Note: In production, you should not expose the token directly
            // This is just for demonstration purposes
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error in password reset request",
            error: error.message 
        });
    }
});

// Verify Reset Token
const verifyResetToken = asyncHandler(async (req, res) => {
    const { token } = req.params;

    try {
        // Find valid token
        const resetToken = await ResetPasswordToken.findOne({
            token,
            isUsed: false,
            createdAt: { $gt: new Date(Date.now() - 1800000) } // 30 minutes
        });

        if (!resetToken) {
            return res.status(400).json({ 
                message: "Invalid or expired password reset token" 
            });
        }

        res.status(200).json({ 
            message: "Token is valid",
            userId: resetToken.userId 
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error verifying reset token",
            error: error.message 
        });
    }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Find valid token
        const resetToken = await ResetPasswordToken.findOne({
            token,
            isUsed: false,
            createdAt: { $gt: new Date(Date.now() - 1800000) } // 30 minutes
        });

        if (!resetToken) {
            return res.status(400).json({ 
                message: "Invalid or expired password reset token" 
            });
        }

        // Find and update user's password
        const user = await User.findById(resetToken.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update password
        user.passWord = newPassword;
        await user.save();

        // Mark token as used
        resetToken.isUsed = true;
        await resetToken.save();

        res.status(200).json({ message: "Password has been reset successfully" });

    } catch (error) {
        res.status(500).json({ 
            message: "Error resetting password",
            error: error.message 
        });
    }
});

module.exports = {
    requestPasswordReset,
    verifyResetToken,
    resetPassword
};
