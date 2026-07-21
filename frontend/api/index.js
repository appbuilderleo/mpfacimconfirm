const express = require('express');
require('dotenv').config();

const rsvpRoutes = require('./routes/rsvp');
const adminRoutes = require('./routes/admin');

const app = express();
const port = process.env.PORT || 5000;

// Basic Express App without complex middlewares that might crash Serverless
app.use(express.json());

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
