import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/user/google/callback`
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let existingUser = await userModel.findOne({ googleId: profile.id });
                if (existingUser) {
                    return done(null, existingUser);
                }
                existingUser = await userModel.findOne({ email: profile.emails[0].value });
                if (existingUser) {
                    existingUser.googleId = profile.id;
                    existingUser.authProvider = 'google';
                    existingUser.profilePicture = profile.photos[0]?.value;
                    await existingUser.save();
                    return done(null, existingUser);
                }

                const newUser = await userModel.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    authProvider: 'google',
                    profilePicture: profile.photos[0]?.value
                });
                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;

