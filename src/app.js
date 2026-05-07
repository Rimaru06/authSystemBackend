require('dotenv').config();
const express = require('express');
const connectDB  = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5000', 'http://localhost:5173'],
    credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));

app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
    res.status(200).json({ message : "Welcome to the auth API" });
})

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

