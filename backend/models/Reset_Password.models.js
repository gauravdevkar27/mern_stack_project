const mongoose = require('mongoose');
const {Schema} = mongoose;

const resetPasswordTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1800 // Token expires in 0.5 hour (1800 seconds)
    },
    isUsed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const ResetPasswordToken = mongoose.model('ResetPasswordToken', resetPasswordTokenSchema);
module.exports = ResetPasswordToken;