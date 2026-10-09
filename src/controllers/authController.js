const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
  }

  try {
    // 1. Busca o usuário pelo e-mail
    const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const usuario = rows[0];

    // 2. Compara a senha digitada com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    // 3. Gera o Token JWT com validade de 8 horas
    const secret = process.env.JWT_SECRET || 'secreto_temporario_dev';
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      secret,
      { expiresIn: '8h' }
    );

    // 4. Retorna os dados do usuário (sem a senha) e o Token
    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
};

module.exports = {
  login
};
