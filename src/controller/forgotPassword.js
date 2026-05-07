const crypto = require('crypto');
const User = require('../models/user');
const sendEmail = require('../utils/email');

const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "If an account exists, a reset link has been sent." });
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

    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return res.status(500).json({ message: "An error occurred while processing your request." });
    }
}