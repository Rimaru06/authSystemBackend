const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asynHandler');
const AppError = require('../utils/AppError');

const Login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new AppError("Email and password are required", 400);
        }

        const user = await User.findOne({ email });
        if (!user) {
            throw new AppError("Invalid credentials", 400);
        }
        if (!user.isVerified) {
            throw new AppError("Please verify your email before logging in", 400);
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            throw new AppError("Invalid credentials", 400);
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        user.refreshTokens.push(refreshToken);
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful",
            accessToken
        });
});

module.exports = Login;