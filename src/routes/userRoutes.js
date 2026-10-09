const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { autenticarToken } = require('../middlewares/authMiddleware');

// Rota pública: Cadastro de novos usuários
router.post('/usuarios', userController.criarUsuario);

// Rota protegida: Apenas usuários com JWT válido podem listar
router.get('/usuarios', autenticarToken, userController.listarUsuarios);

module.exports = router;
