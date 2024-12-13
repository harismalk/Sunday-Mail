const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const User = require('../models/User');
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const email = req.user.profile.emails[0].value;
  const user = await User.findOne({ email });
  res.json(user.integratedAccounts || []);
});

module.exports = router;