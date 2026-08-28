import express from 'express';
import { registerUser, loginUser, userCredits, googleCallback, payCredits, forgotPassword, resetPassword } from '../controllers/userController.js';
import userAuth from '../middlewares/auth.js';
import passport from '../config/passport.js';

const router = express.Router();

const createRateLimiter = ({ windowMs, max, message }) => {
    const attempts = new Map();
    let requestCount = 0;

    return (req, res, next) => {
        requestCount += 1;
        if (requestCount % 1000 === 0) {
            const now = Date.now();
            for (const [key, record] of attempts.entries()) {
                if (now >= record.resetAt) {
                    attempts.delete(key);
                }
            }
        }

        const clientKey = req.ip || req.socket?.remoteAddress || 'unknown';
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
router.post('/forgot-password', authAttemptLimiter, forgotPassword);
router.post('/reset-password', authAttemptLimiter, resetPassword);
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