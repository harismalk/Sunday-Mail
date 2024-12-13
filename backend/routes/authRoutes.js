const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();

router.get('/google', passport.authenticate('google'));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  async (req, res) => {
    const userEmail = req.user.profile.emails[0].value;
    const displayName = req.user.profile.displayName ||
      (req.user.profile.name && req.user.profile.name.givenName) ||
      userEmail;

    let user = await User.findOne({ email: userEmail });
    if (!user) {
      user = new User({
        email: userEmail,
        name: displayName,
        provider: 'google',
        googleId: req.user.profile.id,
        accessToken: req.user.accessToken,
        refreshToken: req.user.refreshToken,
        integratedAccounts: [{
          email: userEmail,
          provider: "Gmail",
          connectedAt: new Date()
        }]
      });
    } else {
      user.accessToken = req.user.accessToken;
      user.refreshToken = req.user.refreshToken;
      if (!user.integratedAccounts.find(acc => acc.email === userEmail)) {
        user.integratedAccounts.push({
          email: userEmail,
          provider: "Gmail",
          connectedAt: new Date()
        });
      }
    }

    await user.save();
    res.redirect('http://localhost:3000/');
  }
);

router.get('/user', (req, res) => {
  if (req.user) {
    const email = req.user.profile.emails[0].value;
    const name = req.user.profile.displayName ||
      (req.user.profile.name && req.user.profile.name.givenName) ||
      email ||
      'User';
    res.json({ email, provider: req.user.provider, name });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
