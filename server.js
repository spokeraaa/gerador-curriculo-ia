const path = require('path');
const express = require('express');
const basicAuth = require('express-basic-auth');

const app = express();  // Criar a instância do Express

app.use(express.json()); // Para aceitar JSON no corpo das requisições

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Autenticação básica
app.use(basicAuth({
  users: { 'spokeraaa': 'senha123' },
  challenge: true,
  unauthorizedResponse: (req) => 'Acesso negado: credenciais inválidas'
}));

// Rota para servir a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota POST para gerar currículo com OpenAI
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
