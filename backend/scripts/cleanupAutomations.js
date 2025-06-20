const mongoose = require('mongoose');
const Automation = require('../models/Automation');
require('dotenv').config();

async function cleanupAutomations() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all automations
    const allAutomations = await Automation.find({});
    console.log(`Found ${allAutomations.length} total automations`);

    // Group by user
    const automationsByUser = {};
    allAutomations.forEach(auto => {
      if (!automationsByUser[auto.userId]) {
        automationsByUser[auto.userId] = [];
      }
      automationsByUser[auto.userId].push(auto);
    });

    console.log(`Found ${Object.keys(automationsByUser).length} users with automations`);

    // Check each user's automations
    for (const [userId, automations] of Object.entries(automationsByUser)) {
      console.log(`\nUser ${userId}:`);
      console.log(`  Total automations: ${automations.length}`);
      
      const activeAutomations = automations.filter(auto => auto.isActive);
      const inactiveAutomations = automations.filter(auto => !auto.isActive);
      
      console.log(`  Active automations: ${activeAutomations.length}`);
      console.log(`  Inactive automations: ${inactiveAutomations.length}`);

      if (inactiveAutomations.length > 0) {
        console.log('  Inactive automations:');
        inactiveAutomations.forEach(auto => {
          console.log(`    - ${auto.label} (ID: ${auto._id}) - Created: ${auto.createdAt}`);
        });
      }
    }

    // Optionally, permanently delete very old inactive automations
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const oldInactiveAutomations = await Automation.find({
      isActive: false,
      updatedAt: { $lt: thirtyDaysAgo }
    });

    if (oldInactiveAutomations.length > 0) {
      console.log(`\nFound ${oldInactiveAutomations.length} old inactive automations (older than 30 days)`);
      console.log('These can be safely deleted. To delete them, uncomment the following lines:');
      console.log('// await Automation.deleteMany({ _id: { $in: oldInactiveAutomations.map(a => a._id) } });');
      console.log('// console.log("Deleted old inactive automations");');
    }

    console.log('\nCleanup analysis complete!');

  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the cleanup if this script is executed directly
if (require.main === module) {
  cleanupAutomations();
}

module.exports = { cleanupAutomations }; 