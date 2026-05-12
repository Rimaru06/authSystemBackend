const User = require('../models/user');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../middleware/asynHandler');
const AppError = require('../utils/AppError');
const sendEmail = require('../utils/sendEmail');
const crypto = require("crypto");

const signUp = asyncHandler(async (req , res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        throw new AppError("All fields are required", 400);
        }

        const existingUser = await User.findOne({
            email,
        })

        if (existingUser) {
            throw new AppError("User already exists", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password : hashedPassword
        })
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const hashedVerificationToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
        user.verificationToken = hashedVerificationToken;
        user.verificationTokenExpiry = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const verificationEmail = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
        await sendEmail({
            to: user.email,
            subject: "Welcome to Our App!",
            text: `Hi ${user.name},\n\nThank you for signing up! Please verify your email by clicking the following link: ${verificationEmail}\n\nBest regards,\nThe Team`,
        });

        res.status(201).json({ message: "we have sent a verification email, Please check your inbox" });
})

module.exports = signUp;