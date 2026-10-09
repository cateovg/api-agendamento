require('dotenv').config();
const express = require('express');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota de Healthcheck
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Agrupamento de rotas
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', appointmentRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} no modo ${process.env.NODE_ENV || 'development'}`);
});
