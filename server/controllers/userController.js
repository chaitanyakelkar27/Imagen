import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Please provide all required fields' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData = {
            name,
            email,
            password: hashedPassword
        }
        const newUser = new userModel(userData);
        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in registering user',
            error
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.authProvider === 'google') {
            return res.json({ success: false, message: 'Please login using Google Sign-In' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.json({ success: true, token, user: { name: user.name } });
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in logging in',
            error
        });
    }
};

const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        res.json({ success: true, creditBalance: user.creditBalance, user: { name: user.name } });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in fetching user credits',
            error
        });
    }
};

const googleCallback = async (req, res) => {
    try {
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.redirect(`${process.env.CLIENT_URL}/google-auth?token=${token}`);
    } catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/login?error=Google authentication failed`);
    }
};

export { registerUser, loginUser, userCredits, googleCallback };