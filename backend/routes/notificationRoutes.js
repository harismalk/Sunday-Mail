const express = require('express');
const { sendNotification } = require('../controllers/notifications');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

router.post('/', requireAuth, (req, res) => {
  const { subscription, payload } = req.body;
  try {
    sendNotification(subscription, payload);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;
