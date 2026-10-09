const db = require('../config/db');

// Criar novo agendamento com verificação de choque de horário
const criarAgendamento = async (req, res) => {
  const { servico, data_inicio, data_fim } = req.body;
  const usuario_id = req.usuario.id;

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

// Listar agendamentos do usuário com filtro opcional por intervalo
const listarAgendamentos = async (req, res) => {
  const usuario_id = req.usuario.id;
  const { inicio, fim } = req.query;

  try {
    let query = `
      SELECT id, servico, data_inicio, data_fim, status, criado_em
      FROM agendamentos
      WHERE usuario_id = $1
    `;
    const params = [usuario_id];

    if (inicio && fim) {
      params.push(new Date(inicio), new Date(fim));
      query += ` AND data_inicio >= $2 AND data_fim <= $3`;
    }

    query += ` ORDER BY data_inicio ASC;`;

    const result = await db.query(query, params);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erro ao listar agendamentos:', error);
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

// Cancelar agendamento do usuário logado
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
