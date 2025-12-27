import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/mongodb.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
await connectDB();

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
