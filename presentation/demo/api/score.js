// Sends one leaf photo to the computer that runs the model and returns its answer.
// MODEL_URL is the address of that computer. If it is not set, or the computer is off, the page says the live model is off.
const MAX_BYTES = 8_000_000;

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks);
  if (raw.length) return raw;
  return Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const base = (process.env.MODEL_URL || "").replace(/\/+$/, "");
  if (!base) return res.status(503).json({ error: "offline" });

  const photo = await readBody(req);
  if (!photo.length || photo.length > MAX_BYTES) return res.status(413).json({ error: "photo missing or too large" });

  try {
    const upstream = await fetch(`${base}/score`, {
      method: "POST",
      headers: { "Content-Type": "image/jpeg", "bypass-tunnel-reminder": "1" },
      body: photo,
      signal: AbortSignal.timeout(50_000),
    });
    if (upstream.status === 400) return res.status(400).json({ error: "not an image" });
    const answer = upstream.ok ? await upstream.json() : null;
    if (!answer || typeof answer.score !== "number") return res.status(503).json({ error: "offline" });
    return res.status(200).json(answer);
  } catch (err) {
    return res.status(503).json({ error: "offline" });
  }
};
