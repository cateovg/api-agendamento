const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Verifica o estado da API
 *     description: Retorna o status atual da aplicação para healthcheck.
 *     responses:
 *       200:
 *         description: API funcionando corretamente.
 */
router.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;
