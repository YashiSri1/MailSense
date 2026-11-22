// Base AI Abstraction Layer
const analyzeWithLLM = async (prompt, systemInstruction, schema) => {
  // If no API key is provided, return a deterministic mock based on the schema
  if (!process.env.AI_API_KEY || process.env.AI_API_KEY === 'your_ai_api_key') {
    return generateMockResponse(prompt, schema);
  }

  // Here you would integrate with an actual LLM provider (e.g. OpenAI, Anthropic, Gemini)
  // using the structured outputs feature to ensure the response matches the schema.
  
  throw new Error("AI provider integration not fully implemented in this abstraction yet.");
};

const generateMockResponse = (prompt, schema) => {
  // A simple heuristic mock for demo mode when no API key is present
  const text = prompt.toLowerCase();
  
  if (schema.name === 'EmailClassification') {
    return {
      category: text.includes('interview') || text.includes('job') ? 'CAREER' 
              : text.includes('pay') || text.includes('bill') ? 'FINANCE' 
              : text.includes('assignment') ? 'EDUCATION' 
              : 'OTHER',
      priority: text.includes('urgent') || text.includes('interview') ? 'HIGH' : 'LOW',
      intent: text.includes('interview') ? 'INTERVIEW' : 'INFORMATION',
      confidence: 0.85
    };
  }
  
  if (schema.name === 'EmailSummary') {
    return {
      summary: "This is a mock AI generated summary. Connect an AI provider to generate real summaries."
    };
  }
  
  if (schema.name === 'ActionExtraction') {
    return {
      requiresAction: text.includes('please') || text.includes('submit'),
      requiresResponse: text.includes('let me know') || text.includes('reply'),
      action: text.includes('submit') ? 'Submit requested documents' : null,
      deadline: text.includes('tomorrow') ? new Date(Date.now() + 86400000).toISOString() : null
    };
  }
  
  return {};
};

module.exports = { analyzeWithLLM };
