const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  emailId: { type: String, required: true, unique: true }, // Unique Gmail Message ID
  labelApplied: String, // Label applied by automation
  actionsTaken: [String], // Actions performed
  processedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
