export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { businessName, industry, style, extra } = req.body;

  const prompt = `
You are a professional web designer. Generate only valid HTML and CSS for a one-page modern landing site. 
Make it visually appealing and responsive. No code blocks or explanations, just HTML.

Sections:
- Hero section with brand name and tagline.
- About or description related to the industry.
- 3 feature/service cards.
- Testimonial quote.
- Contact call-to-action.

Details:
- Business: ${businessName}
- Industry: ${industry}
- Visual style: ${style}
- Extra notes: ${extra}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an expert front-end web designer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.8,
        max_tokens: 1200,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(500).json({ error: "OpenAI API request failed" });
    }

    const html = data.choices?.[0]?.message?.content || "<div>Generation failed.</div>";

    res.status(200).json({ html });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
