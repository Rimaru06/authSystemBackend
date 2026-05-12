const express = require('express');
const signUp = require('../controller/singup');
const Login = require('../controller/login');
const protect = require('../middleware/authMiddleware');
const refreshToken = require('../controller/refreshToken');
const validate = require('../middleware/validate');
const logout = require('../controller/logout');
const { registerValidation, loginValidation } = require('../validations/authValidation');

const router = express.Router();

router.post('/signup', validate(registerValidation) , signUp);
router.post('/login', validate(loginValidation), Login);
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        message: "User profile",
        user: req.user
    });
});
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

module.exports = router;