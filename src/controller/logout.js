const User = require('../models/user.js');

const asyncHandler =
require('../middleware/asynHandler.js');

const AppError =
require('../utils/AppError.js');

const logout = asyncHandler(async (req, res) => {

    const refreshToken =
        req.cookies.refreshToken;

    if (!refreshToken) {

        throw new AppError(
            "Refresh token is required",
            400
        );
    }

    const user = await User.findOne({
        refreshTokens: refreshToken
    });

    if (user) {

        user.refreshTokens =
            user.refreshTokens.filter(
                (token) => token !== refreshToken
            );

        await user.save();
    }

    res.clearCookie('refreshToken', {

        httpOnly: true,

        secure:
            process.env.NODE_ENV === 'production',

        sameSite: 'strict'
    });

    return res.status(200).json({
        message: "Logged out successfully"
    });
});

module.exports = logout;