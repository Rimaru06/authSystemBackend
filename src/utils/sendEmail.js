const nodemailer = require('nodemailer');
const asyncHandler = require('../middleware/asynHandler');
const AppError = require('../utils/AppError');
const sendEmail = asyncHandler(async (options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth : {
                user : process.env.EMAIL_USER,
                pass : process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
        from : process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text
        };
        await transporter.sendMail(mailOptions);
})

module.exports = sendEmail;