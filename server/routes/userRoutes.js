import express from 'express';
import { registerUser, loginUser, userCredits, googleCallback, payCredits } from '../controllers/userController.js';
import userAuth from '../middlewares/auth.js';
import passport from '../config/passport.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
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