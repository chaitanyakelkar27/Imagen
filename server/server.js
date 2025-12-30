import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import userRouter from './routes/userRoutes.js';
import connectDB from './config/mongodb.js';
import imageRouter from './routes/imageRoutes.js';
import passport from './config/passport.js';


dotenv.config();

// Validate required environment variables
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

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

await connectDB();

app.use('/api/user', userRouter);

app.use('/api/image', imageRouter);

app.get('/', (req, res) => {
    res.send('Server is running properly');
});

// Global error handler
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
