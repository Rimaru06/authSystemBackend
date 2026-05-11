const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');

const userSchema = new moongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['user', 'admin'],
        default : 'user'
    },
    verificationToken : String,
    verificationTokenExpiry : Date,
    isVerified : {
        type : Boolean,
        default : false
    },
    refreshTokens: [String],
    resetToken: String,
    resetTokenExpiry: Date
}, {
    timestamps : true
})

module.exports = mongoose.model('User', userSchema);