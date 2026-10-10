require('dotenv').config();
const express = require('express');
const statusRoutes = require('./src/routes/statusRoutes');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const swaggerDocs = require('./src/config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Registro centralizado de rotas
app.use('/api', statusRoutes);
app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', appointmentRoutes);

// Inicializa a documentação Swagger
swaggerDocs(app);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
