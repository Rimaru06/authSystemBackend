const User = require('../models/user.js');
const asyncHandler = require('../middleware/asynHandler.js');
const AppError = require('../utils/AppError.js');
const crypto = require('crypto');

const verifyEmail = asyncHandler(async (req, res) => {
        const { token } = req.query;
        const hashedVerificationToken = crypto.createHash("sha256").update(token).digest("hex");

        if (!token) {
            throw new AppError("Email verification failed", 400);
        }

        const user = await User.findOne({
            verificationToken: hashedVerificationToken,
            verificationTokenExpiry : {
                $gt : Date.now()
            }
        })

        if (!user) {
            throw new AppError("Email verification failed", 400);
        }

        if (user.isVerified) {
            throw new AppError("Email already verified", 400);
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiry = undefined;
        await user.save();

        return res.status(200).json({
            message: "Email verified successfully"
        });
})

module.exports = verifyEmail;