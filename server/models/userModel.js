import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String, unique: true, sparse: true },
    profilePic: { type: String },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    creditBalance: { type: Number, default: 5 }
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel;