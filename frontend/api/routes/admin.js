const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');


const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2b$10$blK41VoiZSVyoPL8ixIlNeWPo/DRbP30urimyOCtR5zB7CIdt4on6';

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
router.post('/login', async (req, res) => {
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
    res.status(500).json({ error: 'Erro interno', details: err.message });
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

    // Add Document Title
    worksheet.mergeCells('A1:D1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Relatório de Inscrições - Maputo Província a caminho da 61ª Edição FACIM 2026';
    titleCell.font = { name: 'Arial', size: 16, bold: true };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 40;

    // Add empty row
    worksheet.addRow([]);

    // Set Columns
    worksheet.columns = [
      { key: 'nome', width: 30 },
      { key: 'email', width: 30 },
      { key: 'celular', width: 20 },
      { key: 'data_confirmacao', width: 25 },
    ];

    // Add Header Row
    const headerRow = worksheet.addRow({
      nome: 'Nome',
      email: 'Email',
      celular: 'Celular',
      data_confirmacao: 'Data de Confirmação'
    });

    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFDA6040' } // Cor primária do sistema
    };
    
    // Add borders to header
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      };
    });

    worksheet.autoFilter = 'A3:D3';
    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 3 }];

    rows.forEach((row) => {
      const addedRow = worksheet.addRow({
        nome: row.nome,
        email: row.email,
        celular: row.celular,
        data_confirmacao: new Date(row.data_confirmacao).toLocaleString('pt-MZ')
      });
      
      // Add solid black borders to each cell in the data row
      addedRow.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } },
          left: { style: 'thin', color: { argb: 'FF000000' } },
          bottom: { style: 'thin', color: { argb: 'FF000000' } },
          right: { style: 'thin', color: { argb: 'FF000000' } }
        };
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
