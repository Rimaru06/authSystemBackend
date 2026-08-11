const joi = require('joi');

const registerValidation = joi.object({
    name : joi.string().min(3).max(30).required(),
    email : joi.string().email().required(),
    password : joi.string().min(6).required()
});

const loginValidation = joi.object({
    email : joi.string().email().required(),
    password : joi.string().min(6).required()
});

const forgotPasswordValidation = joi.object({
    email : joi.string().email().required()
});

module.exports = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation
};