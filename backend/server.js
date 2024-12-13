require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cron = require('node-cron');

require('./config/db')();
require('./passport/googleStrategy');

const authRoutes = require('./routes/authRoutes');
const draftRoutes = require('./routes/draftRoutes');
const emailRoutes = require('./routes/emailRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const automationsRoutes = require('./routes/automationsRoutes');
const integrationsRoutes = require('./routes/integrationsRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userConfigRoutes = require('./routes/userConfigRoutes');

const { fetchEmails } = require('./controllers/gmail');
const { categorizeAndApplyAutomations } = require('./controllers/categorize_emails');
const User = require('./models/User');


const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/emails', emailRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/automations', automationsRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user-config', userConfigRoutes);

// Automated Email Processing
cron.schedule('*/5 * * * *', async () => {
  console.log('Running automated email processing...');
  try {
    const users = await User.find(); // Fetch all users
    for (let user of users) {
      console.log(`Processing emails for user: ${user.email}`);
      const emails = await fetchEmails(user); // Fetch emails for each user

      for (let email of emails) {
        const result = await categorizeAndApplyAutomations(user, email);
        if (result.actionsTaken.length > 0) {
          console.log(`Email matched label: "${result.label}"`);
          console.log(`Actions taken: ${result.actionsTaken.join(', ')}`);
        }
      }
    }
  } catch (error) {
    console.error('Error in automated email processing:', error);
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
