const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, system } = req.body;
    const params = {
      model: 'claude-opus-4-5-20251101',
      max_tokens: 1500,
      messages: messages
    };
    if (system) params.system = system;
    const response = await client.messages.create(params);
    res.json({ content: response.content[0].text });
  } catch (error) {
    console.error('Erreur:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
