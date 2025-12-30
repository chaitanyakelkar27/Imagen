import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        index: true
    },
    prompt: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isFavorite: { type: Boolean, default: false, index: true },
    category: {
        type: String,
        enum: ['nature', 'technology', 'people', 'animals', 'architecture', 'others'],
        default: 'others',
        index: true
    },
    createdAt: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

imageSchema.index({ userId: 1, createdAt: -1 });
imageSchema.index({ userId: 1, isFavorite: 1, createdAt: -1 });
imageSchema.index({ userId: 1, category: 1, createdAt: -1 });

const imageModel = mongoose.models.image || mongoose.model('image', imageSchema);

export default imageModel;

