const express = require('express');
const router = express.Router();
const pool = require('../db');


// POST /api/rsvp - Submit form
router.post('/', async (req, res) => {
  try {
    const { nome, email, celular, privacidade_aceite } = req.body;

    // Basic validation
    if (!nome || !email || !celular || privacidade_aceite !== true) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios e a privacidade deve ser aceite.' });
    }

    if (nome.trim().split(' ').length < 2) {
      return res.status(400).json({ error: 'Por favor, insira o nome completo (mínimo 2 palavras).' });
    }

    // Insert into DB
    const query = `
      INSERT INTO rsvp (nome, email, celular, privacidade_aceite)
      VALUES ($1, $2, $3, $4)
      RETURNING id, data_confirmacao;
    `;
    const values = [nome, email, celular, privacidade_aceite];
    
    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Participação confirmada com sucesso!',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    // Unique constraint violation check could go here if we add unique constraints on email/celular
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
