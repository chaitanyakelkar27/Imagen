import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import userRouter from './routes/userRoutes.js';
import connectDB from './config/mongodb.js';
import imageRouter from './routes/imageRoutes.js';
import passport from './config/passport.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
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

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
