const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');
const rateLimit = require('express-rate-limit');

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5, // 5 tentativas de login
  message: { error: 'Demasiadas tentativas de login falhadas. Tente novamente em 15 minutos.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// POST /api/admin/login
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  
  if (username !== ADMIN_USERNAME) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  try {
    const match = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (match) {
      const token = jwt.sign({ username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Erro interno' });
  }
});

// GET /api/admin/inscritos (Protected)
router.get('/inscritos', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const query = `
      SELECT id, nome, email, celular, data_confirmacao 
      FROM rsvp 
      ORDER BY data_confirmacao DESC 
      LIMIT $1 OFFSET $2;
    `;
    const countQuery = `SELECT COUNT(*) FROM rsvp;`;

    const { rows } = await pool.query(query, [limit, offset]);
    const { rows: countRows } = await pool.query(countQuery);
    
    const total = parseInt(countRows[0].count);

    res.json({
      data: rows,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    res.status(500).json({ error: 'Erro ao buscar dados.' });
  }
});

// GET /api/admin/exportar (Protected)
router.get('/exportar', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT nome, email, celular, data_confirmacao 
      FROM rsvp 
      ORDER BY data_confirmacao DESC;
    `;
    const { rows } = await pool.query(query);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inscritos');

    worksheet.columns = [
      { header: 'Nome', key: 'nome', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Celular', key: 'celular', width: 20 },
      { header: 'Data de Confirmação', key: 'data_confirmacao', width: 25 },
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF000000' } // Black background
    };
    worksheet.autoFilter = 'A1:D1';
    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

    rows.forEach((row) => {
      worksheet.addRow({
        nome: row.nome,
        email: row.email,
        celular: row.celular,
        data_confirmacao: new Date(row.data_confirmacao).toLocaleString('pt-MZ')
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    const fileName = `inscritos-facim-2026-${new Date().toISOString().split('T')[0]}.xlsx`;
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${fileName}`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error exporting RSVPs:', error);
    res.status(500).json({ error: 'Erro ao gerar exportação.' });
  }
});

module.exports = router;
