export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-OpenRouter-Key'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const customKey = req.headers['x-openrouter-key'] || (req.body && req.body.customApiKey);
    const apiKey = customKey || process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(400).json({ error: 'Missing OpenRouter API Key in environment variables.' });
    }

    const { mood, situation, note, durationSeconds, catalog } = req.body || {};

    const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': req.headers.referer || 'https://after-hours-playlist.vercel.app',
        'X-Title': 'After Hours Playlist'
      },
      body: JSON.stringify({
        model: 'poolside/laguna-xs-2.1',
        temperature: 0.45,
        max_tokens: 700,
        messages: [
          {
            role: 'system',
            content: 'You are a music curator. Select songs only from the exact catalog provided. Return valid JSON only: {"titles":[up to 10 exact titles in listening order],"reason":"one evocative sentence under 25 words"}. Build a flowing set that fits the user mood and situation, approaching but not exceeding the time target in seconds. Never invent titles.'
          },
          {
            role: 'user',
            content: JSON.stringify({ mood, situation, note, durationSeconds, catalog })
          }
        ]
      })
    });

    if (!openrouterRes.ok) {
      const errText = await openrouterRes.text();
      return res.status(openrouterRes.status).json({
        error: `OpenRouter returned status ${openrouterRes.status}: ${errText}`
      });
    }

    const data = await openrouterRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Vercel API Handler Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
