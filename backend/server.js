require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('MySQL connected successfully.');
  } catch (error) {
    console.error('Could not connect to MySQL:', error.message);
    console.error('Make sure MySQL is running and the database exists.');
  }

  app.listen(PORT, () => {
    console.log(`Beyond Today API running on http://localhost:${PORT}`);
  });
}

start();
