const RATE_LIMIT = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 10;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    RATE_LIMIT.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_MAX;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute and try again.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { gpa, lsat, urm, softs, timingLabel, results } = req.body;

    if (!gpa || !lsat || !results || !Array.isArray(results)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (gpa < 2.0 || gpa > 4.33 || lsat < 120 || lsat > 180) {
      return res.status(400).json({ error: 'Invalid GPA or LSAT values' });
    }

    const timingNote = timingLabel ? `Application date timing: ${timingLabel}` : 'No date provided';
    const summary = results.map(r =>
      `${r.name}: Accept ${r.accept}% / WL ${r.waitlist}% / Deny ${r.deny}% | Schol: ${r.scholLabel} ~${r.scholLikelihood}% / $${r.estMin}-$${r.estMax} | Seats: ~${r.seats}`
    ).join('\n');

    const system = 'You are a top law school admissions counselor. Give 3-4 sentences of sharp, actionable strategy. Reference specific schools by name. Prioritize timing urgency if relevant. No filler.';
    const userMessage = `GPA:${gpa} LSAT:${lsat} URM:${urm} Softs:${softs}\n${timingNote}\n2025-26 cycle: apps up 23% nationally. March 2026 - many T14s near class capacity.\n\n${summary}\n\nGive strategic insight covering admission positioning, waitlist strategy, and scholarship leverage.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 900,
        system,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(response.status).json({ error: `API error: ${response.status}` });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Strategy API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
