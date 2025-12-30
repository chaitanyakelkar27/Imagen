import express from 'express';
import { registerUser, loginUser, userCredits, googleCallback } from '../controllers/userController.js';
import userAuth from '../middlewares/auth.js';
import passport from '../config/passport.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/credits', userAuth, userCredits);

router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: process.env.FRONTEND_URL,
        session: false
    }),
    googleCallback
);

export default router;