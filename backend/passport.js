const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('./models/User'); // Adjust the path if needed

passport.serializeUser((user, done) => {
  // Serialize user ID to save in session
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Find user by ID and pass to done
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Called when GitHub sends user’s data back
      try {
        // Find existing user
        let existingUser = await User.findOne({ githubId: profile.id });

        if (existingUser) {
          // User already in DB
          return done(null, existingUser);
        }

        // Otherwise, create a new user
        const newUser = new User({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          profileUrl: profile.profileUrl,
          photos: profile.photos?.map((photo) => photo.value) || [],
        });
        await newUser.save();
        done(null, newUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
