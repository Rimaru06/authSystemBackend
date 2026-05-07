const crypto = require('crypto');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const sendEmail = require('../utils/email');

const resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.query.token).digest('hex');
        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        await sendEmail({
            to: user.email,
            subject: "Password Reset Successful",
            text: "Your password has been reset successfully. If you did not perform this action, please contact support immediately.",
        });
        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = resetPassword;