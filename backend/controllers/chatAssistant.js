const { OpenAI } = require('openai');
const { fetchEmails } = require('./gmail');
const User = require('../models/User');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function handleUserRequest(user, message) {
  let systemMessage = `You are Sunday, an AI assistant that can manage emails, reply, schedule meetings. User: ${user.email}`;

  // Fetch user’s recent emails for context
  const emails = await fetchEmails(user);
  const emailContext = emails.slice(0,5).map(e => `Subject: ${e.subject}, From: ${e.from}, Snippet: ${e.body.slice(0,100)}`).join('\n');
  systemMessage += `\nRecent emails:\n${emailContext}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: message },
    ],
  });

  return response.choices[0].message.content.trim();
}

module.exports = { handleUserRequest };
