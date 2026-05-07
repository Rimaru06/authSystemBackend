const User = require('../models/User');

const logout = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(200).json({
                message: "Already logged out"
            });
        }

        const user = await User.findOne({ refreshToken });

        if (user) {
            user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
            await user.save();
        }

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        return res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {

        console.error("Logout Error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = logout;