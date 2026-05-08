const generateProductDescription = async (prompt) => {
  const controller = new AbortController();

  const timeoutMs = Number(process.env.LLM_TIMEOUT_MS || 30000);

  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const model = process.env.AI_MODEL || "gemini-2.5-flash";

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    const response = await fetch(apiUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 512,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              description: {
                type: "string",
              },
            },
            required: ["description"],
          },
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        `Gemini API error. Status: ${response.status}. Body: ${responseText}`
      );
    }

    const data = JSON.parse(responseText);

    const finishReason = data?.candidates?.[0]?.finishReason;

    if (finishReason === "MAX_TOKENS") {
      throw new Error(
        `Gemini stopped because maxOutputTokens was reached. Body: ${responseText}`
      );
    }

    const outputText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!outputText) {
      throw new Error(
        `Gemini response missing output text. Body: ${responseText}`
      );
    }

    return JSON.parse(outputText);
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Gemini API timeout after ${timeoutMs}ms`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = {
  generateProductDescription,
};