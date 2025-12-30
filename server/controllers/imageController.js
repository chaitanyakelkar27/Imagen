import axios from 'axios';
import userModel from '../models/userModel.js';
import FormData from 'form-data';


export const generateImage = async (req, res) => {
    try {
        const { userId, prompt } = req.body;
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
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { $inc: { creditBalance: -1 } },
            { new: true }
        );
        res.status(200).json({ success: true, image: resultImage, creditBalance: updatedUser.creditBalance });
    } catch (error) {
        console.error('Image generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in generating image'
        });
    }

}
