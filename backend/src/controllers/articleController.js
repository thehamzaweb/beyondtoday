const slugify = require('slugify');
const Article = require('../models/Article');
const Category = require('../models/Category');

function computeReadingTime(content) {
  const words = (content || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

exports.listArticles = async (req, res) => {
  const { status, search, category, page = 1, limit = 9 } = req.query;

  try {
    const { articles, total } = await Article.findAll({
      status: status === 'draft' ? 'draft' : undefined,
      search,
      categorySlug: category,
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 9,
    });
    res.json({ articles, total, page: parseInt(page, 10) || 1, limit: parseInt(limit, 10) || 9 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getArticleBySlug = async (req, res) => {
  try {
    const article = await Article.findBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }
    res.json({ article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createArticle = async (req, res) => {
  const {
    title,
    excerpt,
    content,
    featured_image,
    category_id,
    reading_time,
    status,
  } = req.body;

  if (!title || !content || !category_id || !status) {
    return res.status(400).json({ message: 'Title, content, category and status are required.' });
  }

  if (!['published', 'draft'].includes(status)) {
    return res.status(400).json({ message: 'Status must be "published" or "draft".' });
  }

  try {
    const slug =
      (req.body.slug && req.body.slug.trim()) || slugify(title, { lower: true, strict: true });

    const finalReadingTime =
      parseInt(reading_time, 10) > 0 ? parseInt(reading_time, 10) : computeReadingTime(content);

    const existing = await Article.findBySlug(slug);
    if (existing) {
      return res.status(409).json({ message: 'Article with this slug already exists.' });
    }

    const id = await Article.create({
      title,
      slug,
      excerpt: excerpt || '',
      content,
      featured_image: featured_image || '',
      category_id,
      reading_time: finalReadingTime,
      status,
    });

    const article = await Article.findById(id);
    res.status(201).json({ article });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateArticle = async (req, res) => {
  const id = req.params.id;
  const {
    title,
    excerpt,
    content,
    featured_image,
    category_id,
    reading_time,
    status,
  } = req.body;

  if (!title || !content || !category_id || !status) {
    return res.status(400).json({ message: 'Title, content, category and status are required.' });
  }

  if (!['published', 'draft'].includes(status)) {
    return res.status(400).json({ message: 'Status must be "published" or "draft".' });
  }

  try {
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    let slug = (req.body.slug && req.body.slug.trim()) || slugify(title, { lower: true, strict: true });
    const existing = await Article.findBySlug(slug);
    if (existing && existing.id !== parseInt(id, 10)) {
      return res.status(409).json({ message: 'Article with this slug already exists.' });
    }

    const finalReadingTime =
      parseInt(reading_time, 10) > 0 ? parseInt(reading_time, 10) : computeReadingTime(content);

    await Article.update(id, {
      title,
      slug,
      excerpt: excerpt || '',
      content,
      featured_image: featured_image || '',
      category_id,
      reading_time: finalReadingTime,
      status,
    });

    const updated = await Article.findById(id);
    res.json({ article: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }
    await Article.delete(req.params.id);
    res.json({ message: 'Article deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getLatestArticles = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 6;
  try {
    const articles = await Article.findPublishedLatest(limit);
    res.json({ articles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getRelatedArticles = async (req, res) => {
  try {
    const article = await Article.findBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }
    const related = await Article.findRelated(article.slug, article.category_id, 3);
    res.json({ articles: related });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const articleStats = await Article.countByStatus();
    const categoryCount = await Category.countAll();
    res.json({
      totalArticles: articleStats.total,
      publishedArticles: articleStats.published,
      draftArticles: articleStats.draft,
      categories: categoryCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
