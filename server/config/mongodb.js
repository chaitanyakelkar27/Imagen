import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        // Handle both local Docker and cloud MongoDB Atlas URIs
        const mongoURI = process.env.MONGODB_URI.includes('mongodb+srv') 
            ? `${process.env.MONGODB_URI}/imagen`  // Cloud Atlas
            : `${process.env.MONGODB_URI}/imagen?authSource=admin`;  // Local Docker

        await mongoose.connect(mongoURI);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}
export default connectDB;