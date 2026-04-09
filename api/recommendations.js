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
    const { gpa, lsat, urm, softs, timingKey, stateFilter, tuitionMax, schools } = req.body;

    if (!gpa || !lsat || !schools || !Array.isArray(schools)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (gpa < 2.0 || gpa > 4.33 || lsat < 120 || lsat > 180) {
      return res.status(400).json({ error: 'Invalid GPA or LSAT values' });
    }

    const schoolList = schools.map(s =>
      `${s.name}|${s.tier}|${s.city},${s.state}|acc${Math.round(s.accept_rate * 100)}%|L${s.median_lsat}|G${s.median_gpa}|$${Math.round(s.tuition / 1000)}k|grant$${Math.round(s.med_grant / 1000)}k`
    ).join('\n');

    const filterNote = (stateFilter || tuitionMax)
      ? `\nIMPORTANT FILTERS: ${stateFilter ? `Strongly prefer schools in ${stateFilter}.` : ''} ${tuitionMax ? `Strongly prefer tuition under $${tuitionMax.toLocaleString()}.` : ''} Prioritize schools matching these filters but include 1-2 non-matching schools per bucket if they are exceptionally strong fits.`
      : '';

    const system = 'You are an expert law school admissions counselor. You MUST respond with ONLY valid JSON. No markdown fences, no text before or after the JSON object. Keep all strings concise (under 25 words each).';
    const userMessage = `Student: GPA ${Number(gpa).toFixed(2)}, LSAT ${lsat}, URM: ${urm}, Softs: ${softs}, Timing: ${timingKey}.${filterNote}

Schools (name|tier|location|accept rate|med LSAT|med GPA|tuition|med grant):
${schoolList}

Return ONLY this JSON (no markdown, no backticks):
{"summary":"2-3 sentence overview","reach":[{"name":"exact school name","reason":"why reach","tip":"tactical tip"}],"target":[{"name":"exact school name","reason":"why target","tip":"tactical tip"}],"safety":[{"name":"exact school name","reason":"why safety","tip":"tactical tip"}]}
Pick 5 schools per bucket (15 total). Use exact school names from the list above.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
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
    console.error('Recommendations API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
