const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../models/user.js');
const sendEmail = require('../utils/sendEmail.js');

const asyncHandler = require('../middleware/asynHandler.js');
const AppError = require('../utils/AppError.js');

const resetPassword = asyncHandler(async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.query.token).digest('hex');
    const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        });
        if (!user) {
            throw new AppError("Invalid or expired token", 400);
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
})

module.exports = resetPassword;