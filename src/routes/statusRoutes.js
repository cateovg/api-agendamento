const express = require('express');
const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

module.exports = router;
