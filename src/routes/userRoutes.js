const express = require('express');
const signUp = require('../controller/singup');
const Login = require('../controller/login');
const protect = require('../middleware/authMiddleware');
const refreshToken = require('../controller/refreshToken');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', Login);
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        message: "User profile",
        user: req.user
    });
});

router.post('/refresh-token', refreshToken);

module.exports = router;