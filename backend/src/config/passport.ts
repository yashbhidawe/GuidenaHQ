import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import { Profile, VerifyCallback } from "passport-google-oauth20";

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../utils/secrets";
import { User } from "../models/User";

const GoogleStrategy = passportGoogle.Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/google/redirect",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const user = await User.findOne({
          googleId: profile.id,
        });

        if (!user) {
          const newUser = await User.create({
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            email: profile.emails ? profile.emails[0].value : "",
            googleId: profile.id,
            avatar: profile.photos
              ? profile.photos[0].value
              : "https://avatar.iran.liara.run/public/boy?username=Ash",
          });

          return done(null, newUser);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);
