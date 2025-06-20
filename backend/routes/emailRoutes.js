const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { fetchEmails } = require('../controllers/gmail');
const { categorizeAndApplyAutomations } = require('../controllers/categorize_emails');
const User = require('../models/User');
const EmailLog = require('../models/EmailLog');

const router = express.Router();

// Process emails and apply automations
router.get('/process-emails', requireAuth, async (req, res) => {
  try {
    const email = req.user.profile.emails[0].value;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const emails = await fetchEmails(user);

    const results = [];
    for (let email of emails) {
      const result = await categorizeAndApplyAutomations(user, email);
      results.push(result);
    }

    res.json({ message: 'Emails processed successfully', results });
  } catch (error) {
    console.error('Error processing emails:', error);
    res.status(500).json({ error: 'Failed to process emails' });
  }
});

// Test fetching emails without processing
router.get('/test-fetch-emails', requireAuth, async (req, res) => {
  try {
    const email = req.user.profile.emails[0].value;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const emails = await fetchEmails(user);
    res.json({ message: 'Fetched emails successfully', emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

router.get('/logs', requireAuth, async (req, res) => {
  try {
    const logs = await EmailLog
      .find({ userId: req.user._id })
      .sort({ processedAt: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch logs' });
  }
});

module.exports = router;