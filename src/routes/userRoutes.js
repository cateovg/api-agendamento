const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/usuarios', userController.listarUsuarios);
router.post('/usuarios', userController.criarUsuario);

module.exports = router;
