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
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in registering user'
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

        if (!user.password) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.json({ success: true, token, user: { name: user.name } });
        } else {
            return res.json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in logging in'
        });
    }
};

const userCredits = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, creditBalance: user.creditBalance, user: { name: user.name } });

    } catch (error) {
        console.error('Credits fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error in fetching user credits'
        });
    }
};

const googleCallback = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.redirect(`${process.env.CLIENT_URL}/auth/callback?error=Authentication failed`);
        }
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?error=Google authentication failed`);
    }
};

const payCredits = async (req, res) => {
    try {
        const userId = req.userId;
        const { planId } = req.body;

        const plans = {
            'Basic': { credits: 100, price: 10 },
            'Advanced': { credits: 500, price: 50 },
            'Business': { credits: 5000, price: 250 }
        };

        if (!plans[planId]) {
            return res.status(400).json({ success: false, message: 'Invalid plan selected' });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.creditBalance += plans[planId].credits;
        await user.save();

        res.json({
            success: true,
            message: `Successfully added ${plans[planId].credits} credits`,
            creditBalance: user.creditBalance,
            creditsAdded: plans[planId].credits
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing payment'
        });
    }
};

export { registerUser, loginUser, userCredits, googleCallback, payCredits };