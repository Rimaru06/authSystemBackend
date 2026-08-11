const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const asyncHandler = require('../middleware/asynHandler.js');
const AppError = require('../utils/AppError.js');

const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppError("No refresh token provided", 401);
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.refreshTokens.includes(refreshToken)) {
            throw new AppError("Invalid refresh token", 401);
        }

        user.refreshTokens = user.refreshTokens.filter(token => token !== refreshToken);
        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        user.refreshTokens.push(newRefreshToken);
        await user.save();

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Token refreshed successfully",
            accessToken
        });
})

module.exports = refreshToken;