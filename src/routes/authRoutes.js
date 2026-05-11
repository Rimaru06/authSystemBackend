const express = require('express');
const refreshToken = require('../controller/refreshToken');
const { forgotPasswordValidation } = require('../validations/authValidation');
const { validate } = require('../models/user');
const forgotPassword = require('../controller/forgotPassword');
const resetPassword = require('../controller/resetPassword');


const router = express.Router();


router.post("/refresh-token", refreshToken);
router.post("/forgot-password", validate(forgotPasswordValidation) , forgotPassword);
router.post("/reset-password",resetPassword);
router.get("/verify-email", verifyEmail);


module.exports = router;