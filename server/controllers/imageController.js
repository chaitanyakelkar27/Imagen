import axios from 'axios';
import userModel from '../models/userModel.js';
import imageModel from '../models/imageModel.js';
import FormData from 'form-data';
import mongoose from 'mongoose';

export const generateImage = async (req, res) => {
    try {
        const { userId, prompt, category } = req.body;
        const user = await userModel.findById(userId);
        if (!user || !prompt) {
            return res.status(400).json({ success: false, message: 'Invalid request' });
        }

        if (user.creditBalance <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient credits. Please buy more credits to generate images.',
                creditBalance: 0
            });
        }

        const formData = new FormData();
        formData.append('prompt', prompt);
        const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: 'arraybuffer'
        });

        const base64Image = Buffer.from(data, 'binary').toString('base64');
        const resultImage = `data:image/png;base64,${base64Image}`;

        const newImage = new imageModel({
            userId,
            prompt,
            imageUrl: resultImage,
            category: category || 'other'
        })
        await newImage.save();

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $inc: { creditBalance: -1 } },
            { new: true }
        );

        res.status(200).json({ success: true, image: resultImage, imageId: newImage._id, creditBalance: updatedUser.creditBalance });
    } catch (error) {
        console.error('Image generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in generating image'
        });
    }
};

export const getUserImages = async (req, res) => {
    try {
        const { userId } = req.body;
        const { page = 1, limit = 12, search = '', category = 'all', isFavorite, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const query = { userId };
        if (search && search.trim() !== '') {
            query.prompt = { $regex: search.trim(), $options: 'i' };
        }
        if (category && category !== 'all') {
            query.category = category;
        }
        if (isFavorite !== undefined) {
            query.isFavorite = isFavorite === 'true';
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const images = await imageModel
            .find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const totalImages = await imageModel.countDocuments(query);

        res.json({
            success: true,
            images,
            pagination: {
                totalImages,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalImages / parseInt(limit)),
                hasNextPage: parseInt(page) * parseInt(limit) < totalImages,
                hasPrevPage: parseInt(page) > 1
            }
        });

    } catch (error) {
        console.error('Get user images error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in fetching images'
        });
    }
};

export const deleteImage = async (req, res) => {
    try {
        const { userId } = req.body;
        const { imageId } = req.params;

        const image = await imageModel.findOne({ _id: imageId, userId });

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found or unauthorized' });
        }

        await imageModel.findByIdAndDelete(imageId);

        res.json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in deleting image'
        });
    }
};

export const deleteMultipleImages = async (req, res) => {
    try {
        const { userId, imageIds } = req.body;

        if (!Array.isArray(imageIds) || imageIds.length === 0) {
            return res.status(400).json({ success: false, message: 'No image IDs provided' });
        }

        if (imageIds.length > 50) {
            return res.status(400).json({ success: false, message: 'Cannot delete more than 50 images at once' });
        }

        const deleteResult = await imageModel.deleteMany({ _id: { $in: imageIds }, userId });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'No images found to delete or unauthorized' });
        }

        res.json({
            success: true,
            message: `${deleteResult.deletedCount} image(s) deleted successfully`,
            deletedCount: deleteResult.deletedCount
        });
    } catch (error) {
        console.error('Delete multiple images error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in deleting images'
        });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
        const { userId } = req.body;
        const { imageId } = req.params;

        const image = await imageModel.findOne({ _id: imageId, userId });

        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found or unauthorized' });
        }

        image.isFavorite = !image.isFavorite;

        await image.save();

        const message = image.isFavorite
            ? 'Added to favorites'
            : 'Removed from favorites';

        res.json({ success: true, message, isFavorite: image.isFavorite });

    } catch (error) {
        console.error('Toggle favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in toggling favorite status'
        });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const { userId } = req.body;
        const totalImages = await imageModel.countDocuments({ userId });
        const favoriteImages = await imageModel.countDocuments({ userId, isFavorite: true });
        const categoryStats = await imageModel.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json({
            success: true,
            stats: {
                total: totalImages,
                favorites: favoriteImages,
                byCategory: categoryStats
            }
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in fetching user stats'
        });
    }
};