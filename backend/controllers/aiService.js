const axios = require('axios');

async function callAiService(labelDescription, emailContent) {
  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: 'gpt-3.5-turbo',
      prompt: `Does the following email content match this description: "${labelDescription}"? Reply with "true" or "false".\n\nEmail Content:\n${emailContent}`,
      max_tokens: 10,
      temperature: 0,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const result = response.data.choices[0].text.trim().toLowerCase();
    return result === 'true';
  } catch (error) {
    console.error('Error calling AI service:', error);
    return false; // Fallback to "no match" in case of an error
  }
}

module.exports = { callAiService };
