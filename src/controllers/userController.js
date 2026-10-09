const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Listar usuários (sem expor a senha)
const listarUsuarios = async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, nome, email, tipo, criado_em FROM usuarios');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
};

// Criar novo usuário com senha criptografada
const criarUsuario = async (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  // Validação simples dos campos obrigatórios
  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
  }

  try {
    // 1. Verifica se o e-mail já está cadastrado
    const usuarioExiste = await db.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (usuarioExiste.rows.length > 0) {
      return res.status(400).json({ erro: 'E-mail já cadastrado no sistema.' });
    }

    // 2. Gera o hash da senha (fator de custo 10)
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // 3. Insere no banco utilizando Prepared Statement (evita SQL Injection)
    const query = `
      INSERT INTO usuarios (nome, email, senha, tipo)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nome, email, tipo, criado_em
    `;
    const values = [nome, email, senhaHash, tipo || 'cliente'];

    const { rows } = await db.query(query, values);

    // Retorna o usuário criado (sem a senha)
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
};

module.exports = {
  listarUsuarios,
  criarUsuario
};
