const db = require('../config/db');

// Criar novo agendamento com verificação de choque de horário
const criarAgendamento = async (req, res) => {
  const { servico, data_inicio, data_fim } = req.body;
  const usuario_id = req.usuario.id; // Extraído do JWT pelo authMiddleware

  if (!servico || !data_inicio || !data_fim) {
    return res.status(400).json({ erro: 'Serviço, data de início e data de fim são obrigatórios.' });
  }

  const inicio = new Date(data_inicio);
  const fim = new Date(data_fim);

  if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
    return res.status(400).json({ erro: 'Formato de data inválido. Use ISO 8601 (ex: 2026-10-10T14:00:00Z).' });
  }

  if (inicio >= fim) {
    return res.status(400).json({ erro: 'A data de início deve ser anterior à data de fim.' });
  }

  try {
    // 1. Checar se existe algum agendamento ativo que se sobrepõe ao horário solicitado
    const conflitoQuery = `
      SELECT id FROM agendamentos
      WHERE status != 'cancelado'
        AND data_inicio < $2
        AND data_fim > $1
      LIMIT 1;
    `;
    const conflitoResult = await db.query(conflitoQuery, [inicio, fim]);

    if (conflitoResult.rows.length > 0) {
      return res.status(409).json({ erro: 'Horário indisponível. Já existe um agendamento conflitante.' });
    }

    // 2. Inserir o agendamento se o horário estiver livre
    const insertQuery = `
      INSERT INTO agendamentos (usuario_id, servico, data_inicio, data_fim)
      VALUES ($1, $2, $3, $4)
      RETURNING id, usuario_id, servico, data_inicio, data_fim, status, criado_em;
    `;
    const novoAgendamento = await db.query(insertQuery, [usuario_id, servico, inicio, fim]);

    return res.status(201).json(novoAgendamento.rows[0]);
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor ao processar agendamento.' });
  }
};

// Listar agendamentos do usuário logado
const listarAgendamentos = async (req, res) => {
  const usuario_id = req.usuario.id;

  try {
    const query = `
      SELECT id, servico, data_inicio, data_fim, status, criado_em
      FROM agendamentos
      WHERE usuario_id = $1
      ORDER BY data_inicio ASC;
    `;
    const result = await db.query(query, [usuario_id]);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

module.exports = {
  criarAgendamento,
  listarAgendamentos
};

// Cancelar agendamento do usuario logado
const cancelarAgendamento = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.usuario.id;

  try {
    const query = `
      UPDATE agendamentos
      SET status = 'cancelado'
      WHERE id = $1 AND usuario_id = $2 AND status != 'cancelado'
      RETURNING id, servico, status;
    `;
    const result = await db.query(query, [id, usuario_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ erro: 'Agendamento não encontrado ou já cancelado.' });
    }

    return res.status(200).json({ mensagem: 'Agendamento cancelado com sucesso.', agendamento: result.rows[0] });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

module.exports = {
  criarAgendamento,
  listarAgendamentos,
  cancelarAgendamento
};
