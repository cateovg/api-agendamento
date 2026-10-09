require('dotenv').config();
const express = require('express');
const statusRoutes = require('./src/routes/statusRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', statusRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Agendamento rodando com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} no modo ${process.env.NODE_ENV || 'development'}`);
});
