const db = require('../config/db');

// Rota temporária de teste para listar usuários
const listarUsuarios = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, nome, email, tipo, criado_em FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
};

module.exports = {
  listarUsuarios
};
