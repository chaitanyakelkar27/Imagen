import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: false, select: false },
    googleId: { type: String, unique: true, sparse: true },
    profilePic: { type: String },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    creditBalance: { type: Number, default: 5 }
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;