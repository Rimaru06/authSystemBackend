const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/asynHandler.js');
const AppError = require('../utils/AppError.js');
const sendEmail = require('../utils/sendEmail.js');
const crypto = require("crypto");

const signUp = asyncHandler(async (req , res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        throw new AppError("All fields are required", 400);
        }

        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isVerified) {
            throw new AppError("User already exists", 400);
        }

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const hashedVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");

        let user;
        if (existingUser && !existingUser.isVerified) {
            // Reuse existing unverified user — update name, password, and refresh token
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.verificationToken = hashedVerificationToken;
            existingUser.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
            user = await existingUser.save();
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({
                name,
                email,
                password: hashedPassword,
                verificationToken: hashedVerificationToken,
                verificationTokenExpiry: Date.now() + 24 * 60 * 60 * 1000,
            });
            await user.save();
        }

        const verificationEmail = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
        try {
            await sendEmail({
                to: user.email,
                subject: "Welcome to Our App!",
                text: `Hi ${user.name},\n\nThank you for signing up! Please verify your email by clicking the following link: ${verificationEmail}\n\nBest regards,\nThe Team`,
            });
        } catch (emailError) {
            await User.findByIdAndDelete(user._id);
            throw new AppError("Failed to send verification email. Please try again.", 500);
        }

        res.status(201).json({ message: "We have sent a verification email, please check your inbox" });
})

module.exports = signUp;