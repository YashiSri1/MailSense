const { analyzeWithLLM } = require('./aiService');

const summarizeEmail = async (email) => {
  const prompt = `Subject: ${email.subject}\nBody: ${email.body || email.snippet}`;
  
  const schema = {
    name: 'EmailSummary',
    type: 'object',
    properties: {
      summary: { type: 'string' }
    }
  };

  const result = await analyzeWithLLM(prompt, "Summarize this email in 1 to 3 concise sentences.", schema);
  return result;
};

module.exports = { summarizeEmail };
