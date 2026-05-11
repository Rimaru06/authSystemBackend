const crypto = require('crypto');
const User = require('../models/user');
const sendEmail = require('../utils/email');
const asyncHandler = require('../middleware/asynHandler');
const AppError = require('../utils/AppError');

const forgotPassword = asyncHandler(async (req, res) => {
        const email = req.body.email;
        if (!email) {
            throw new AppError("Email is required" , 400);
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new AppError("If an account exists, a reset link has been sent.", 404);
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetToken = hashedToken;
        user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        const resetUrl = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: "Password Reset Request",
            text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
        });
});

module.exports = forgotPassword;