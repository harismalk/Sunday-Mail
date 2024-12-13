const { OpenAI } = require('openai');
const Automation = require('../models/Automation');
const User = require('../models/User');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function parseInstructionsToAutomations(userId, instructions) {
  // Validate input
  if (!userId || !instructions) {
    throw new Error('User ID and instructions are required');
  }

  const prompt = `
Extract structured, precise automation rules from these instructions:
${instructions}

Provide a JSON with clear, actionable automation rules.
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.2,
      messages: [
        { 
          role: 'system', 
          content: 'You are an expert in extracting precise email automation rules.' 
        },
        { role: 'user', content: prompt },
      ],
    });

    const content = response.choices[0].message.content.trim();
    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse JSON:', content);
      throw new Error('Invalid automation rule format');
    }

    const automations = parsed.automations || [];
    const savedAutomations = [];

    for (let auto of automations) {
      try {
        const automation = await Automation.findOneAndUpdate(
          { userId, label: auto.label },
          { 
            ...auto, 
            userId,
            isActive: true,
            updatedAt: new Date()
          },
          { 
            upsert: true, 
            new: true,
            runValidators: true 
          }
        );
        savedAutomations.push(automation);
      } catch (saveError) {
        console.error(`Error saving automation ${auto.label}:`, saveError);
      }
    }

    return savedAutomations;
  } catch (error) {
    console.error('Automation parsing error:', error);
    throw error;
  }
}

module.exports = { parseInstructionsToAutomations };