const pool = require('../config/db');

const Category = {
  async findAll() {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.slug, c.description, c.created_at, c.updated_at,
              COUNT(a.id) AS article_count
       FROM categories c
       LEFT JOIN articles a ON a.category_id = c.id
       GROUP BY c.id, c.name, c.slug, c.description, c.created_at, c.updated_at
       ORDER BY c.name ASC`
    );
    return rows;
  },

  async findBySlug(slug) {
    const [rows] = await pool.query(
      `SELECT c.id, c.name, c.slug, c.description, c.created_at, c.updated_at,
              COUNT(a.id) AS article_count
       FROM categories c
       LEFT JOIN articles a ON a.category_id = c.id
       WHERE c.slug = ?
       GROUP BY c.id, c.name, c.slug, c.description, c.created_at, c.updated_at
       LIMIT 1`,
      [slug]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async create({ name, slug, description }) {
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [name, slug, description || '']
    );
    return result.insertId;
  },

  async update(id, { name, slug, description }) {
    await pool.query(
      'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?',
      [name, slug, description || '', id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  },

  async countAll() {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM categories');
    return rows[0].total;
  },
};

module.exports = Category;
