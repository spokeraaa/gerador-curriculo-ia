const express = require('express');
const basicAuth = require('express-basic-auth');
const path = require('path');
const { OpenAI } = require('openai');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(basicAuth({
  users: { 'spokeraaa': 'senha123' },
  challenge: true,
  unauthorizedResponse: () => 'Acesso negado: credenciais inválidas'
}));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/generate', async (req, res) => {
  const { name, email, experience, skills } = req.body;

  const prompt = `
  Gere um currículo profissional com as seguintes informações:
  Nome: ${name}
  Email: ${email}
  Experiência Profissional: ${experience}
  Habilidades: ${skills}

  Escreva de forma profissional, bem formatada.
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
    });

    res.json({ resume: completion.choices[0].message.content });
  } catch (err) {
    console.error('Erro ao gerar currículo:', err);
    res.status(500).send('Erro ao gerar currículo.');
  }
});

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
