const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection and initialize table if it doesn't exist
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }
  console.log('Connected to CockroachDB');
  
  const initSql = `
    CREATE TABLE IF NOT EXISTS rsvp (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      nome VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      celular VARCHAR(50) NOT NULL,
      privacidade_aceite BOOLEAN NOT NULL,
      data_confirmacao TIMESTAMP DEFAULT current_timestamp()
    );
  `;
  
  client.query(initSql, (err, result) => {
    release();
    if (err) {
      console.error('Error executing query', err.stack);
    } else {
      console.log('Table initialized/verified');
    }
  });
});

module.exports = pool;
