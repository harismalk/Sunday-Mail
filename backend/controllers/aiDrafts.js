const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateDraft(subject, body, contextInstructions = '') {
  const prompt = `Write a professional email draft.
Subject: ${subject}
Body: ${body}
Context: ${contextInstructions}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful, professional email drafting assistant.' },
        { role: 'user', content: prompt },
      ],
    });
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating draft:', error.response?.data || error.message);
    throw new Error('Failed to generate draft');
  }
}


module.exports = { generateDraft };
