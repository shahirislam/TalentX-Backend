const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('GEMINI_API_KEY not set; AI endpoints will fail.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
// Use a supported model: gemini-1.5-flash was deprecated; gemini-2.0-flash or gemini-1.5-flash-latest are valid
const modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const model = genAI ? genAI.getGenerativeModel({ model: modelName }) : null;

module.exports = { model, hasGemini: !!model };
