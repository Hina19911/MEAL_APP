// server/index.js  (CommonJS)
require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8787;

// ✅ MOCK mode: return canned answers without calling OpenAI
const MOCK = process.env.MOCK_AI === '1';
if (MOCK) {
  console.log('🧪 MOCK_AI=1 → Using mock responses (no OpenAI calls).');
}

// Only create the client when NOT mocking
const client = !MOCK ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: Date.now(), mock: MOCK });
});

// Main endpoint
app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt string' });
  }

  // 🔁 Early return in MOCK mode
  if (MOCK) {
    return res.json({
      text:
        "Here’s a quick idea: pan-sear chicken with garlic, toss with rice, peas, and lemon. 15 minutes.",
    });
  }

  try {
    const r = await client.responses.create({
      model: 'gpt-4.1-mini', // (use gpt-4o-mini if you prefer and have access)
      instructions:
        'You are a friendly cooking-inspiration assistant. Reply in 2–4 short sentences.',
      input: prompt,
    });
    res.json({ text: r.output_text ?? '' });
  } catch (e) {
    console.error('LLM route failed:', e?.message || e);
    const status = e?.status || 500;
    const code = e?.code || e?.error?.code;
    if (status === 429 || code === 'insufficient_quota') {
      return res.status(429).json({
        error:
          'Insufficient quota on your OpenAI API project. Add payment method or credits, then try again.',
      });
    }
    res.status(status).json({
      error: e?.error?.message || e?.message || 'LLM request failed',
    });
  }
});

app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);
