require('dotenv').config();
const express = require('express');
const connectDB  = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));

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

