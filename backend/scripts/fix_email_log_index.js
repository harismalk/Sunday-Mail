// scripts/fix_email_log_index.js

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

async function fixEmailLogIndex() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const collection = mongoose.connection.collection('emaillogs');

    // Drop the old unique index on emailId if it exists
    try {
      await collection.dropIndex('emailId_1');
      console.log('Dropped old unique index: emailId_1');
    } catch (err) {
      if (err.codeName === 'IndexNotFound' || err.message.includes('index not found')) {
        console.log('Old index emailId_1 not found, nothing to drop.');
      } else {
        throw err;
      }
    }

    // Ensure the new compound index exists
    await collection.createIndex({ userId: 1, emailId: 1 }, { unique: true });
    console.log('Ensured new compound unique index on { userId, emailId }');

    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Error fixing indexes:', err);
    process.exit(1);
  }
}

fixEmailLogIndex();
