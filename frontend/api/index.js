const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const rsvpRoutes = require('./routes/rsvp');
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 5000;

// Security Middleware: Set HTTP Headers
app.use(helmet());

// Restrict CORS to allowed origins
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// Security Middleware: Prevent XSS
app.use(xss());

// Security Middleware: Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100, // Limite de 100 pedidos por IP
  message: { error: 'Demasiados pedidos efetuados. Tente novamente mais tarde.' },
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use('/api', globalLimiter);

// Routes
app.use('/api/rsvp', rsvpRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
