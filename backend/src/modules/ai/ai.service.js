const getGroqClient = require('../../config/groq');

const analyzeCredibility = async (title, description) => {
  try {
    const groq = getGroqClient();
    const prompt = `You are an AI credibility analyzer. Analyze the following post for misinformation, exaggeration, emotional bias, or lack of evidence.

Title: "${title}"
Description: "${description}"

Provide a JSON response with the following structure (and ONLY return valid JSON, no other text):
{
  "score": 0.0 to 1.0 (where 1.0 is very credible, 0.0 is not credible),
  "label": "Likely True" OR "Possibly Misleading" OR "Likely False",
  "reason": "Brief explanation of the analysis"
}`;

    const message = await groq.messages.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from AI');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Validate response structure
    if (!analysis.score || !analysis.label || !analysis.reason) {
      throw new Error('Invalid analysis structure');
    }

    return {
      score: Math.min(1, Math.max(0, parseFloat(analysis.score))),
      label: analysis.label,
      reason: analysis.reason,
      analyzedAt: new Date(),
    };
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw error;
  }
};

module.exports = { analyzeCredibility };
