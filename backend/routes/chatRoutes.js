const express = require('express');
const { handleUserRequest } = require('../controllers/chatAssistant');
const requireAuth = require('../middleware/requireAuth');
const User = require('../models/User');
const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { message } = req.body;
  const email = req.user.profile.emails[0].value;
  const user = await User.findOne({ email });
  try {
    const response = await handleUserRequest(user, message);
    res.json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

module.exports = router;
