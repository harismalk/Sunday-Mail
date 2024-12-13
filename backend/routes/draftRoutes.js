const express = require('express');
const { generateDraft } = require('../controllers/aiDrafts');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

router.post('/', requireAuth, async (req, res) => {
  const { subject, body, contextInstructions } = req.body;
  try {
    const draft = await generateDraft(subject, body, contextInstructions);
    res.json({ draft });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate draft' });
  }
});

module.exports = router;
