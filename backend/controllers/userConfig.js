const User = require('../models/User');

async function getUserInstructions(userId) {
  const user = await User.findById(userId);
  return user.instructions;
}

async function setUserInstructions(userId, instructions) {
  await User.findByIdAndUpdate(userId, { instructions });
}

module.exports = { getUserInstructions, setUserInstructions };
