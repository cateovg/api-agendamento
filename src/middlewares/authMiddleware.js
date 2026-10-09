const jwt = require('jsonwebtoken');

const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'secreto_temporario_dev';
    const usuarioDecodificado = jwt.verify(token, secret);
    
    req.usuario = usuarioDecodificado;
    next();
  } catch (error) {
    return res.status(403).json({ erro: 'Token inválido ou expirado.' });
  }
};

module.exports = {
  autenticarToken
};
