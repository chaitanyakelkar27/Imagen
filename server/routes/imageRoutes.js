import express from 'express';
import { generateImage, getUserImages, deleteImage, deleteMultipleImages, toggleFavorite, getUserStats } from '../controllers/imageController.js';
import userAuth from '../middlewares/auth.js';

const imageRouter = express.Router();

imageRouter.post('/generate-image', userAuth, generateImage);
imageRouter.get('/user-images', userAuth, getUserImages);
imageRouter.delete('/delete/:imageId', userAuth, deleteImage);
imageRouter.post('/delete-multiple', userAuth, deleteMultipleImages);
imageRouter.patch('/favorite/:imageId', userAuth, toggleFavorite);
imageRouter.get('/stats', userAuth, getUserStats);

export default imageRouter;