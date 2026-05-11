const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('../middleware/asynHandler');
const AppError = require('../utils/AppError');

const protect = asyncHandler(async (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new AppError("Not authorized, no token", 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;
        next();
})

module.exports = protect;