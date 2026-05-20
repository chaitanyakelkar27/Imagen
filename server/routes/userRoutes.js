import express from 'express';
import { registerUser, loginUser, userCredits, googleCallback, payCredits } from '../controllers/userController.js';
import userAuth from '../middlewares/auth.js';
import passport from '../config/passport.js';

const router = express.Router();

const createRateLimiter = ({ windowMs, max, message }) => {
    const attempts = new Map();

    return (req, res, next) => {
        const clientKey = req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
        const now = Date.now();
        const record = attempts.get(clientKey);

        if (!record || now >= record.resetAt) {
            attempts.set(clientKey, { count: 1, resetAt: now + windowMs });
            return next();
        }

        if (record.count >= max) {
            return res.status(429).json({ success: false, message });
        }

        record.count += 1;
        return next();
    };
};

const authAttemptLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: 'Too many attempts. Please try again later.'
});

router.post('/register', authAttemptLimiter, registerUser);
router.post('/login', authAttemptLimiter, loginUser);
router.post('/credits', userAuth, userCredits);
router.post('/pay-credits', userAuth, payCredits);

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: process.env.CLIENT_URL,
        session: false
    }),
    googleCallback
);

export default router;