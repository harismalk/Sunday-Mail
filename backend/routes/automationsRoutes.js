const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const Automation = require('../models/Automation');
const User = require('../models/User');
const { createGmailLabel } = require('../controllers/gmail'); // Import createGmailLabel function
const router = express.Router();

// Get all automations with proper error handling
router.get('/', requireAuth, async (req, res) => {
  try {
    const email = req.user.profile.emails[0].value;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const automations = await Automation.find({ userId: user._id }).sort({ updatedAt: -1 });
    res.json(automations);
  } catch (error) {
    console.error('Error fetching automations:', error);
    res.status(500).json({ error: 'Failed to fetch automations' });
  }
});

// Create a new automation
router.post('/', requireAuth, async (req, res) => {
  try {
    const { label, description, conditions, actions } = req.body;
    const email = req.user.profile.emails[0].value;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const automation = new Automation({
      userId: user._id,
      label,
      description,
      conditions,
      actions: actions || {},
    });

    await automation.save();

    // Create Gmail label
    try {
      await createGmailLabel(user, label);
      console.log(`Gmail label "${label}" created successfully.`);
    } catch (error) {
      console.error(`Error creating Gmail label "${label}":`, error.message);
    }

    res.status(201).json(automation);
  } catch (error) {
    console.error('Error creating automation:', error);
    res.status(400).json({ error: error.message || 'Failed to create automation' });
  }
});

// Update an existing automation
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { label, description, conditions, actions } = req.body;
    const email = req.user.profile.emails[0].value;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const automation = await Automation.findOneAndUpdate(
      { _id: req.params.id, userId: user._id },
      {
        ...(label && { label }),
        ...(description && { description }),
        ...(conditions && { conditions }),
        ...(actions && { actions }),
        updatedAt: new Date(),
      },
      { new: true, runValidators: true } // Return updated document and validate
    );

    if (!automation) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    res.json(automation);
  } catch (error) {
    console.error('Error updating automation:', error);
    res.status(400).json({ error: error.message || 'Failed to update automation' });
  }
});

// Delete an automation
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const email = req.user.profile.emails[0].value;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const automation = await Automation.findOneAndDelete({
      _id: req.params.id,
      userId: user._id,
    });

    if (!automation) {
      return res.status(404).json({ error: 'Automation not found' });
    }

    res.json({ message: 'Automation deleted successfully' });
  } catch (error) {
    console.error('Error deleting automation:', error);
    res.status(500).json({ error: 'Failed to delete automation' });
  }
});

module.exports = router;
