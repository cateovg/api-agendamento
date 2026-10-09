require('dotenv').config();
const express = require('express');
const statusRoutes = require('./src/routes/statusRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Importa e ativa as rotas da aplicação
app.use('/api', statusRoutes);
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Agendamento rodando com sucesso!' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} no modo ${process.env.NODE_ENV || 'development'}`);
});
