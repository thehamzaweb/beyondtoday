const pool = require('../config/db');

const Article = {
  async findAll({ status, search, categorySlug, page = 1, limit = 9 } = {}) {
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (status) {
      conditions.push('a.status = ?');
      params.push(status);
    }

    if (search) {
      conditions.push('(a.title LIKE ? OR a.excerpt LIKE ? OR a.content LIKE ?)');
      const like = `%${search}%`;
      params.push(like, like, like);
    }

    if (categorySlug) {
      conditions.push('c.slug = ?');
      params.push(categorySlug);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.content, a.featured_image,
              a.reading_time, a.status, a.published_at, a.created_at, a.updated_at,
              c.id AS category_id, c.name AS category_name, c.slug AS category_slug
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       ${where}
       ORDER BY a.published_at DESC, a.id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       ${where}`,
      params
    );

    return { articles: rows, total: countRows[0].total };
  },

  async findPublishedLatest(limit = 6) {
    const [rows] = await pool.query(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.content, a.featured_image,
              a.reading_time, a.status, a.published_at, a.created_at, a.updated_at,
              c.id AS category_id, c.name AS category_name, c.slug AS category_slug
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.status = 'published'
       ORDER BY a.published_at DESC, a.id DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async findBySlug(slug) {
    const [rows] = await pool.query(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.content, a.featured_image,
              a.reading_time, a.status, a.published_at, a.created_at, a.updated_at,
              c.id AS category_id, c.name AS category_name, c.slug AS category_slug
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.slug = ?
       LIMIT 1`,
      [slug]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  async create({ title, slug, excerpt, content, featured_image, category_id, reading_time, status }) {
    const published_at =
      status === 'published' ? new Date() : null;

    const [result] = await pool.query(
      `INSERT INTO articles
        (title, slug, excerpt, content, featured_image, category_id, reading_time, status, published_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, excerpt, content, featured_image, category_id, reading_time, status, published_at]
    );
    return result.insertId;
  },

  async update(id, { title, slug, excerpt, content, featured_image, category_id, reading_time, status }) {
    const existing = await this.findById(id);
    const wasPublished = existing && existing.status === 'published';
    const isNowPublished = status === 'published';

    let published_at = existing?.published_at || null;
    if (isNowPublished && !wasPublished) {
      published_at = new Date();
    }

    await pool.query(
      `UPDATE articles SET
        title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?,
        category_id = ?, reading_time = ?, status = ?, published_at = ?
       WHERE id = ?`,
      [title, slug, excerpt, content, featured_image, category_id, reading_time, status, published_at, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM articles WHERE id = ?', [id]);
  },

  async countByStatus() {
    const [rows] = await pool.query(
      `SELECT status, COUNT(*) AS total FROM articles GROUP BY status`
    );
    const result = { published: 0, draft: 0, total: 0 };
    rows.forEach((r) => {
      result[r.status] = r.total;
      result.total += r.total;
    });
    return result;
  },

  async findRelated(slug, categoryId, limit = 3) {
    const [rows] = await pool.query(
      `SELECT a.id, a.title, a.slug, a.excerpt, a.content, a.featured_image,
              a.reading_time, a.published_at,
              c.id AS category_id, c.name AS category_name, c.slug AS category_slug
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.status = 'published'
         AND a.slug != ?
         AND a.category_id = ?
       ORDER BY a.published_at DESC
       LIMIT ?`,
      [slug, categoryId, limit]
    );
    return rows;
  },
};

module.exports = Article;
