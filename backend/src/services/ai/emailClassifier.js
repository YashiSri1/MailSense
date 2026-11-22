const { analyzeWithLLM } = require('./aiService');

const classifyEmail = async (email) => {
  const prompt = `Subject: ${email.subject}\nSnippet: ${email.snippet}\nSender: ${email.sender}`;
  
  const schema = {
    name: 'EmailClassification',
    type: 'object',
    properties: {
      category: { type: 'string' },
      priority: { type: 'string' },
      intent: { type: 'string' },
      confidence: { type: 'number' }
    }
  };

  const result = await analyzeWithLLM(prompt, "Classify this email into a category, priority, and intent.", schema);
  return result;
};

module.exports = { classifyEmail };
