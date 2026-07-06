const geminiProvider = require("../../providers/llm/geminiProvider");

const generateProductDescription = async (prompt) => {
  const provider = process.env.AI_PROVIDER || "openai";


  if (provider === "gemini") {
    return geminiProvider.generateProductDescription(prompt);
  }
  throw new Error(`Unsupported LLM provider: ${provider}`);
};

module.exports = {
  generateProductDescription,
};