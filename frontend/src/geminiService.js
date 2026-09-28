const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
export const askGemini = async (message) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You are the AI assistant of the Smart Water Billing Administration Platform.

Your responsibilities:
- Explain water bills
- Explain tariff plans
- Explain invoices
- Explain billing cycles
- Explain water conservation
- Help users navigate the website
- Answer FAQs about the platform

User Question:
${message}

Instructions:
- Answer in maximum 3-5 sentences.
- Use simple language.
- Give bullet points when possible.
- Do not provide unnecessary explanations.
- If the question is unrelated to water billing, politely redirect.
`,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received."
    );
  } catch (error) {
    console.error(error);
    return "Sorry, I couldn't contact Gemini AI.";
  }
};
