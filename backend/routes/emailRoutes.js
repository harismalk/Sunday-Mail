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

// Get email logs with enhanced filtering and statistics
router.get('/logs', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 50, search, filter } = req.query;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = { userId: req.user._id };
    
    // Add search filter
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { from: { $regex: search, $options: 'i' } },
        { labelApplied: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add time filter
    if (filter) {
      const now = new Date();
      let startDate;
      
      switch (filter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        query.processedAt = { $gte: startDate };
      }
    }
    
    const logs = await EmailLog
      .find(query)
      .sort({ processedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await EmailLog.countDocuments(query);
    
    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: 'Could not fetch logs' });
  }
});

// Get email logs statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    
    // Calculate date ranges
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Get counts
    const [total, todayCount, weekCount, monthCount] = await Promise.all([
      EmailLog.countDocuments({ userId }),
      EmailLog.countDocuments({ userId, processedAt: { $gte: today } }),
      EmailLog.countDocuments({ userId, processedAt: { $gte: weekAgo } }),
      EmailLog.countDocuments({ userId, processedAt: { $gte: monthAgo } })
    ]);
    
    // Get unique labels
    const labels = await EmailLog.distinct('labelApplied', { userId });
    
    // Get action statistics
    const actionStats = await EmailLog.aggregate([
      { $match: { userId } },
      { $unwind: '$actionsTaken' },
      { $group: { _id: '$actionsTaken', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get recent activity (last 7 days)
    const recentActivity = await EmailLog.aggregate([
      { $match: { userId, processedAt: { $gte: weekAgo } } },
      { $group: { 
        _id: { 
          $dateToString: { format: "%Y-%m-%d", date: "$processedAt" } 
        }, 
        count: { $sum: 1 } 
      }},
      { $sort: { _id: -1 } }
    ]);
    
    res.json({
      total,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount,
      uniqueLabels: labels.length,
      labels: labels,
      actionStats,
      recentActivity
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Could not fetch statistics' });
  }
});

module.exports = router;