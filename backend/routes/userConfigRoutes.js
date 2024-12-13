const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { getUserInstructions, setUserInstructions } = require('../controllers/userConfig');
const User = require('../models/User');
const router = express.Router();

router.get('/instructions', requireAuth, async (req, res) => {
  const email = req.user.profile.emails[0].value;
  const user = await User.findOne({ email });
  const instructions = await getUserInstructions(user._id);
  res.json({ instructions });
});

router.post('/instructions', requireAuth, async (req, res) => {
  const { instructions } = req.body;
  const email = req.user.profile.emails[0].value;
  const user = await User.findOne({ email });
  await setUserInstructions(user._id, instructions);
  res.json({ message: 'Instructions updated', instructions });
});

module.exports = router;
