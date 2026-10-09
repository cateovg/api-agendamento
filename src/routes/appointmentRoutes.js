const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { autenticarToken } = require('../middlewares/authMiddleware');

router.use(autenticarToken);

router.post('/agendamentos', appointmentController.criarAgendamento);
router.get('/agendamentos', appointmentController.listarAgendamentos);
router.patch('/agendamentos/:id/cancelar', appointmentController.cancelarAgendamento);

module.exports = router;
