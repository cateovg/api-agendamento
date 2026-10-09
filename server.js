const express = require('express');
const statusRoutes = require('./src/routes/statusRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Importa e ativa as rotas separadas
app.use('/api', statusRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Agendamento rodando com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
