import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from "axios";
import nodemailer from "nodemailer";

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

const sendResetEmail = async (email, resetToken, name) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hi ${name || 'there'},</p>
            <p>We received a request to reset your password for your Imagen account.</p>
            <p>Click the button below to set a new password. This link will expire in 15 minutes:</p>
            <div style="margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #2563eb; font-size: 14px; word-break: break-all;">${resetUrl}</p>
            <p style="color: #888; font-size: 12px; margin-top: 30px;">If you didn't request this email, you can safely ignore it.</p>
        </div>
    `;

    // 1. Try Gmail / SMTP via Nodemailer if SMTP_USER & SMTP_PASS are configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.SMTP_PORT || '465'),
                secure: process.env.SMTP_SECURE !== 'false',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_FROM || `Imagen <${process.env.SMTP_USER}>`,
                to: email,
                subject: 'Password Reset Request - Imagen',
                html: htmlContent
            });
            console.log(`Password reset email sent successfully via Gmail SMTP to ${email}`);
            return resetUrl;
        } catch (smtpError) {
            console.error('Error sending email via SMTP:', smtpError.message);
        }
    }

    // 2. Try Resend API if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
        try {
            await axios.post('https://api.resend.com/emails', {
                from: process.env.EMAIL_FROM || 'Imagen <onboarding@resend.dev>',
                to: [email],
                subject: 'Password Reset Request - Imagen',
                html: htmlContent
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`Password reset email sent successfully via Resend to ${email}`);
            return resetUrl;
        } catch (resendError) {
            console.error('Error sending email via Resend:', resendError.response?.data || resendError.message);
        }
    }

    // 3. Fallback to console output
    console.log(`[DEMO MODE - No email service configured] Reset URL for ${email}: ${resetUrl}`);
    // Fallback: log reset URL to console (useful in development)
    console.log(`[DEMO MODE - No SMTP configured] Reset URL for ${email}: ${resetUrl}`);
    return resetUrl;
};

const forgotPassword = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);

        if (!email || !isValidEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email address. Please register for a new account.'
            });
        }

        // Classify user authentication method using authProvider field
        if (user.authProvider === 'google') {
            return res.status(400).json({
                success: false,
                authProvider: 'google',
                message: 'This account was created using Google Sign-In. Please click "Continue with Google" to log in.'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendResetEmail(user.email, resetToken, user.name);

        return res.json({
            success: true,
            authProvider: 'local',
            message: 'Password reset link has been sent to your email address. Please check your inbox.'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to process password reset request right now. Please try again later.'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || typeof token !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid or missing password reset token.'
            });
        }

        if (!newPassword || !isStrongEnoughPassword(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long.'
            });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await userModel.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        }).select('+password +resetPasswordToken +resetPasswordExpires');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Password reset link is invalid or has expired. Please request a new link.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.json({
            success: true,
            message: 'Password reset successful! You can now log in with your new password.'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to reset password right now. Please try again later.'
        });
    }
};

export { registerUser, loginUser, userCredits, googleCallback, payCredits, forgotPassword, resetPassword };
