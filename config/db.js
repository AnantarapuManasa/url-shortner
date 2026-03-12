const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'url_shortener',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

});

pool.getConnection()
  .then(() => console.log('✅ MySQL pool connected'))
  .catch(err => console.error('❌ MySQL pool connection failed:', err));

const query = async (sql, params) => {
  const [rows] = await pool.execute(sql, params);
  return rows;
};

module.exports = { pool, query };

