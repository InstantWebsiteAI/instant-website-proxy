// api/ping.js — GET test endpoint
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    method: req.method,
    path: req.url
  });
}
