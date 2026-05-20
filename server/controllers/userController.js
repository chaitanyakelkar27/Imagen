import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const isValidEmail = (email) => /^(?:[a-zA-Z0-9_'^&/+-])+(?:\.(?:[a-zA-Z0-9_'^&/+-])+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/.test(email);

const isStrongEnoughPassword = (password) => typeof password === 'string' && password.length >= 8;

const registerUser = async (req, res) => {
    try {
        const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
        const email = normalizeEmail(req.body.email);
        const password = typeof req.body.password === 'string' ? req.body.password : '';

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required.'
            });
        }

        if (name.length < 2 || name.length > 80) {
            return res.status(400).json({
                success: false,
                message: 'Name must be between 2 and 80 characters.'
            });
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.'
            });
        }

        if (!isStrongEnoughPassword(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long.'
            });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Unable to create account. If you already have an account, try logging in or reset your password.'
            });
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
        res.status(201).json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to create account right now. Please try again later.'
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        const password = typeof req.body.password === 'string' ? req.body.password : '';

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        const user = await userModel.findOne({ email }).select('+password');

        if (!user || user.authProvider === 'google' || !user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password. If you signed up with Google, use Google sign-in.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password. If you signed up with Google, use Google sign-in.'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({ success: true, token, user: { name: user.name } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Unable to log in right now. Please try again later.'
        });
    }
};

const userCredits = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please sign in again.'
            });
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
            return res.redirect(`${process.env.CLIENT_URL}/auth/callback#error=Authentication%20failed`);
        }
        const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.redirect(`${process.env.CLIENT_URL}/auth/callback#token=${encodeURIComponent(token)}`);
    } catch (error) {
        console.error('Google callback error:', error);
        res.redirect(`${process.env.CLIENT_URL}/auth/callback#error=Google%20authentication%20failed`);
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
            return res.status(400).json({
                success: false,
                message: 'Please choose a valid plan.'
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please sign in again.'
            });
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
            message: 'Unable to process payment right now. Please try again later.'
        });
    }
};

export { registerUser, loginUser, userCredits, googleCallback, payCredits };