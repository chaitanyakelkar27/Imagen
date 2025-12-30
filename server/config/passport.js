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
            callbackURL: `http://localhost:${process.env.PORT || 5000}/api/user/google/callback`,
            scope: ["profile", "email"]
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

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;

