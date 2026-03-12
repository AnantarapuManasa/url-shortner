const { pool, query } = require('../config/db');

class UrlModel {
  static async create({ originalUrl, shortCode }) {
    const sql = `
      INSERT INTO urls (original_url, short_code, created_at, clicks)
      VALUES (?, ?, NOW(), 0)
    `;
    const result = await query(sql, [originalUrl, shortCode]);
    return result.insertId;
  }

  static async findByShortCode(shortCode) {
    const sql = 'SELECT * FROM urls WHERE short_code = ? LIMIT 1';
    const rows = await query(sql, [shortCode]);
    return rows[0];
  }

  static async incrementClicks(shortCode) {
    const sql = 'UPDATE urls SET clicks = clicks + 1 WHERE short_code = ?';
    await query(sql, [shortCode]);
  }

  static async existsShortCode(shortCode) {
    const sql = 'SELECT 1 FROM urls WHERE short_code = ? LIMIT 1';
    const rows = await query(sql, [shortCode]);
    return rows.length > 0;
  }
}

module.exports = UrlModel;

