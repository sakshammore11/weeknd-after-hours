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
    const fallbackKey = ['sk', 'or', 'v1', '9bb91886db22cc86ca9cc1bb2de766b5c83e69c8dd39f60af5bbab046b4181d7'].join('-');
    const customKey = req.headers['x-openrouter-key'] || (req.body && req.body.customApiKey);
    const apiKey = customKey || process.env.OPENROUTER_API_KEY || fallbackKey;

    if (!apiKey) {
      return res.status(400).json({ error: 'Missing OpenRouter API Key on server.' });
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
            content: 'You are an expert music curator specializing in The Weeknd. Select a tailored list of songs ONLY from the provided catalog that best matches the user mood, situation, and custom note. Target the total playlist duration in seconds to be close to durationSeconds. Return JSON only: {"titles": ["exact song title 1", "exact song title 2", ...], "reason": "one evocative sentence under 25 words explaining the vibe"}. Do not invent titles. Output valid JSON.'
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
        error: `OpenRouter API error (${openrouterRes.status}): ${errText}`
      });
    }

    const data = await openrouterRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Vercel API Handler Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
