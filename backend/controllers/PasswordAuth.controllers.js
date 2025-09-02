const User = require('../models/user.models.js');
const ResetPasswordToken = require('../models/Reset_Password.models.js');
const crypto = require('crypto');
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// In a real app, you would use a more robust token generation strategy
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Controller to request a password reset
const requestPasswordReset = asyncHandler(async (req, res) => {
    const { userName } = req.body;
    if (!userName) {
        res.status(400);
        throw new Error("Username is required");
    }

    const user = await User.findOne({ userName });
    // To prevent user enumeration, always send a success response.
    // The logic inside only runs if the user is found.
    if (user) {
        // Generate a token
        const token = generateToken();

        // Save the token to the database
        const resetToken = new ResetPasswordToken({
            userId: user._id,
            token: token,
        });
        await resetToken.save();

        // In a real application, you would send an email with the reset link.
        // For now, we can log it to the console for testing.
        console.log(`Password reset token for ${userName}: ${token}`);
        console.log(`Reset link: http://localhost:3000/reset-password/${token}`);
    }

    res.status(200).json({
        message: "If an account with that username exists, a password reset link has been sent."
    });
});

// Controller to reset the password using the token
const resetPassword = asyncHandler(async (req, res) => {
    const { userName, newPassword } = req.body;

    if (!userName || !newPassword) {
        res.status(400);
        throw new Error("Username and new password are required");
    }

    const user = await User.findOne({ userName });
    if (!user) {
        res.status(404);
        throw new Error("User not found.");
    }

    user.passWord = newPassword;
    await user.save(); // The pre-save hook will hash the new password

    res.status(200).json({ message: "Password has been reset successfully." });
});

// Controller to verify reset token
const verifyResetToken = asyncHandler(async (req, res) => {
    const { token } = req.params;

    if (!token) {
        res.status(400);
        throw new Error("Token is required");
    }

    const resetTokenDoc = await ResetPasswordToken.findOne({ token });

    if (!resetTokenDoc || resetTokenDoc.isUsed) {
        res.status(400);
        throw new Error("Invalid or expired password reset token.");
    }

    res.status(200).json({ 
        message: "Token is valid",
        userId: resetTokenDoc.userId
    });
});

module.exports = {
    requestPasswordReset,
    resetPassword,
    verifyResetToken
};