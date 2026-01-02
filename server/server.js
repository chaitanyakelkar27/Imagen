import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import connectDB from './config/mongodb.js';
import imageRouter from './routes/imageRoutes.js';
import passport from './config/passport.js';


dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    console.error('Please create a .env file with all required variables');
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());

app.use(passport.initialize());

await connectDB();

app.use('/api/user', userRouter);

app.use('/api/image', imageRouter);

app.get('/', (req, res) => {
    res.send('Server is running properly');
});


app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
