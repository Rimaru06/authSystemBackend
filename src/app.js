require('dotenv').config();
const express = require('express');
const connectDB  = require('./config/db.js');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const errorMiddleware = require('./middleware/errorMiddleware.js');
const AppError = require('./utils/AppError.js');
const { rateLimit } = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: 'draft-8', // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    ipv6Subnet: 64, // Treat each /64 as a single IP for rate limiting
    message: "Too many requests from this IP, please try again later"
})

const app = express();

app.use(limiter);
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5000', 'http://localhost:5173'],
    credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.status(200).json({ message : "Welcome to the auth API" });
})
app.use((req, res, next) => {

    next(
        new AppError(
            `Route ${req.originalUrl} not found`,
            404
        )
    );
});

app.use(errorMiddleware);
const startServer = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT , ()=> {
            console.log(`Server running on ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("server failed to start: ", error);
    }
}

startServer();

