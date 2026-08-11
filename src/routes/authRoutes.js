const express = require('express');
const refreshToken = require('../controller/refreshToken.js');
const { forgotPasswordValidation } = require('../validations/authValidation.js');
const validate = require('../middleware/validate.js');
const forgotPassword = require('../controller/forgotPassword.js');
const resetPassword = require('../controller/resetPassword.js');
const verifyEmail = require('../controller/verifyEmail.js');

const router = express.Router();


router.post("/refresh-token", refreshToken);
router.post("/forgot-password", validate(forgotPasswordValidation),forgotPassword);
router.post("/reset-password",resetPassword);
router.get("/verify-email", verifyEmail);


module.exports = router;