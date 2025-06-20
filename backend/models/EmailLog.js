// backend/models/EmailLog.js
const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emailId: { type: String, required: true },
  from:      { type: String, required: true },   // ← new
  subject:   { type: String, required: true },   // ← new
  labelApplied: String,
  actionsTaken: [String],
  processedAt: { type: Date, default: Date.now }
});

// Add a compound unique index for userId + emailId
emailLogSchema.index({ userId: 1, emailId: 1 }, { unique: true });

module.exports = mongoose.model('EmailLog', emailLogSchema);