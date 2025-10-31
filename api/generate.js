export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  try {
    const { name, email, businessType, websiteGoal } = req.body;

    if (!name || !email || !businessType || !websiteGoal) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const sitePreview = `https://instantwebsite.ai/demo?name=${encodeURIComponent(
      name
    )}&goal=${encodeURIComponent(websiteGoal)}`;

    return res.status(200).json({
      success: true,
      message: "Website generated successfully!",
      preview: sitePreview
    });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
