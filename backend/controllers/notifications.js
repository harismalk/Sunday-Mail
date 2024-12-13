const webPush = require('web-push');

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

function sendNotification(subscription, payload) {
  webPush
    .sendNotification(subscription, payload)
    .catch((err) => console.error('Push Notification Error:', err));
}

module.exports = { sendNotification };
