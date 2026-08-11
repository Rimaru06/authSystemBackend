# MERN Authentication Backend

A secure authentication backend built with Node.js, Express, MongoDB, JWT, and Cookies.

This project includes:

* User Registration
* User Login
* JWT Authentication
* Access Token & Refresh Token Flow
* Secure HTTP-Only Cookies
* Forgot Password
* Reset Password
* Logout Functionality
* Password Hashing with bcrypt
* MongoDB Integration
* Nodemailer Email Support

---

# Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* cookie-parser
* Nodemailer
* dotenv
* helmet
* morgan
* cors

---

# Project Structure

```txt
src/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── forgotPassword.js
│   ├── resetPassword.js
│   └── logout.js
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   └── User.js
│
├── routes/
│   └── authRoutes.js
│
├── utils/
│   └── sendEmail.js
│
├── .env
├── app.js
└── package.json
```

---

# Installation

## 1. Clone Repository

```bash
git clone <your-repository-url>
```

---

## 2. Install Dependencies

```bash
npm install
```

---

# Required Packages

```bash
npm install express mongoose dotenv bcryptjs jsonwebtoken cookie-parser cors helmet morgan nodemailer crypto
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_google_app_password

NODE_ENV=development
```

---

# MongoDB Setup

## Local MongoDB

```env
MONGO_URI=mongodb://localhost:27017/authdb
```

---

## MongoDB Using Docker

Run MongoDB container:

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo
```

Connection URL:

```env
MONGO_URI=mongodb://admin:password@localhost:27017/authdb?authSource=admin
```

---

# Running the Server

```bash
npm run dev
```

or

```bash
node app.js
```

---

# Authentication Flow

## Login Flow

```txt
User Login
    ↓
Server validates credentials
    ↓
Access Token generated
    ↓
Refresh Token generated
    ↓
Refresh Token stored in HTTP-only cookie
    ↓
Access Token returned to frontend
```

---

## Refresh Token Flow

```txt
Access Token expires
    ↓
Frontend calls /refresh-token
    ↓
Backend verifies refresh token
    ↓
New access token generated
```

---

## Forgot Password Flow

```txt
User requests password reset
    ↓
Backend generates reset token
    ↓
Token stored in database
    ↓
Reset link emailed to user
    ↓
User clicks reset link
    ↓
User sets new password
```

---

# API Routes

## Register User

### POST `/api/auth/register`

```json
{
  "name": "Shiva",
  "email": "shiva@gmail.com",
  "password": "password123"
}
```

---

## Login User

### POST `/api/auth/login`

```json
{
  "email": "shiva@gmail.com",
  "password": "password123"
}
```

Response:

```json
{
  "message": "Login successful",
  "accessToken": "jwt_token"
}
```

---

## Refresh Access Token

### POST `/api/auth/refresh-token`

Uses refresh token stored in cookies.

---

## Logout User

### POST `/api/auth/logout`

Clears refresh token cookie and removes token from database.

---

## Forgot Password

### POST `/api/auth/forgot-password`

```json
{
  "email": "shiva@gmail.com"
}
```

---

## Reset Password

### POST `/api/auth/reset-password/:token`

```json
{
  "password": "newpassword123"
}
```

---

# Security Features

* Password hashing using bcrypt
* JWT authentication
* HTTP-only cookies
* Secure cookie support
* Token expiry validation
* Password reset token hashing
* Helmet security middleware
* CORS protection

---

# User Schema Example

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    refreshToken: {
        type: String
    },

    passwordResetToken: {
        type: String
    },

    passwordResetExpires: {
        type: Date
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
```

---

# Cookie Configuration

```js
res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
});
```

---

# Important Notes

* Never expose JWT secrets
* Never commit `.env` file
* Use App Passwords for Gmail
* Store refresh tokens securely
* Use HTTPS in production

---

# Future Improvements

* Email verification
* Multi-device sessions
* OAuth Login
* Rate Limiting
* Account Locking
* Role-Based Access Control
* Refresh Token Rotation
* Redis Session Storage

---

# Author

Shiva Chahar

LinkedIn:
[https://www.linkedin.com/in/shiva-chahar-573287257/](https://www.linkedin.com/in/shiva-chahar-573287257/)

Twitter/X:
[https://x.com/chahar_shiva](https://x.com/chahar_shiva)
