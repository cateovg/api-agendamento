const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { autenticarToken } = require('../middlewares/authMiddleware');

// Todas as rotas de agendamento exigem autenticação via JWT
router.use(autenticarToken);

router.post('/agendamentos', appointmentController.criarAgendamento);
router.get('/agendamentos', appointmentController.listarAgendamentos);

module.exports = router;
