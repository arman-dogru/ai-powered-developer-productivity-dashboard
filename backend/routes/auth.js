const express = require('express');
const passport = require('passport');
const router = express.Router();

// GitHub login route
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: 'http://localhost:3000?error=login_failed' }),
  (req, res) => {
    // Successful authentication
    res.redirect('http://localhost:3000/profile');
  }
);

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {});
  res.send('Logged out');
});

// To check if user is authenticated and get user data
router.get('/user', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not logged in' });
  }
  // Return the user info from the DB session
  res.json(req.user);
});

module.exports = router;
