export default async function handler(req, res) {
  const ORIGIN = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const { businessName = "", industry = "", style = "", extra = "" } = req.body || {};

    const prompt = `
Return ONLY valid HTML (no backticks). One single page with <style> inside.
Dark theme, neon blue accents, rounded cards. Mobile responsive.

Sections:
- Sticky header (fake nav links).
- Hero with business name and CTA buttons.
- About paragraph tailored to industry.
- Services: 3 cards, short titles + blurbs.
- Testimonials: 2 short quotes.
- Contact CTA section with button.

Business:
- Name: ${businessName}
- Industry: ${industry}
- Visual style: ${style}
- Extra notes: ${extra}

Rules:
- No external fonts/scripts. Use system fonts.
- Keep CSS concise (~300 lines max).
- Nicely spaced, readable, modern.
`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You output ONLY raw HTML for a fully styled, responsive one-page site." },
          { role: "user", content: prompt }
        ],
        temperature: 0.6,
        max_tokens: 2200
      })
    });

    const json = await r.json();
    const html = json?.choices?.[0]?.message?.content || "<div style='padding:24px;color:#fff'>Generation failed.</div>";
    return res.status(200).json({ html });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}
