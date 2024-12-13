const mongoose = require('mongoose');

const integratedAccountSchema = new mongoose.Schema({
  email: String,
  provider: String,
  connectedAt: Date
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  provider: String,
  googleId: String,
  accessToken: String,
  refreshToken: String,
  instructions: { type: String, default: '' },
  integratedAccounts: [integratedAccountSchema],
});

module.exports = mongoose.model('User', userSchema);