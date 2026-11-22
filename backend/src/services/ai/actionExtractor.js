const { analyzeWithLLM } = require('./aiService');

const extractActions = async (email) => {
  const prompt = `Subject: ${email.subject}\nBody: ${email.body || email.snippet}`;
  
  const schema = {
    name: 'ActionExtraction',
    type: 'object',
    properties: {
      requiresAction: { type: 'boolean' },
      requiresResponse: { type: 'boolean' },
      action: { type: 'string', nullable: true },
      deadline: { type: 'string', nullable: true }
    }
  };

  const result = await analyzeWithLLM(prompt, "Extract any required actions, responses, and deadlines.", schema);
  return result;
};

module.exports = { extractActions };
