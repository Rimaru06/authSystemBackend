const User = require('../models/user');
const bcrypt = require('bcryptjs');

const signUp = async (req , res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ message : "All fields are required" });
        }

        const existingUser = await User.findOne({
            email,
        })

        if (existingUser) {
            return res.status(400).json({ message : "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password : hashedPassword
        })

        await user.save();

        res.status(201).json({ message : "User created successfully" });
    } catch (error) {
        console.error("Signup error: ", error);
        res.status(500).json({ message : "Server error" });
    }
}

module.exports = signUp;