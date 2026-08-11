const express = require('express');
const signUp = require('../controller/singup.js');
const Login = require('../controller/login.js');
const protect = require('../middleware/authMiddleware.js');
const refreshToken = require('../controller/refreshToken.js');
const validate = require('../middleware/validate.js');
const logout = require('../controller/logout.js');
const { registerValidation, loginValidation } = require('../validations/authValidation.js');

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