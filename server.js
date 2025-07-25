const express = require('express');
const basicAuth = require('express-basic-auth');
const app = express();

app.use(basicAuth({
  users: { 'usuario': 'senha123' },
  challenge: true,
  unauthorizedResponse: (req) => 'Acesso negado: credenciais inválidas'
}));

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
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 700,
    });

    res.json({ resume: completion.data.choices[0].message.content });
  } catch (err) {
    console.error('Erro ao gerar currículo:', err);
    res.status(500).send('Erro ao gerar currículo.');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

