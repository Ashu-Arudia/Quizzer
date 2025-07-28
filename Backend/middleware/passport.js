const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          console.log("yess");
          return done(null, existingUser);
        }

        // If not registered, create a basic user record
        const newUser = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          isProfileComplete: false,
        });

        return done(null, newUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
