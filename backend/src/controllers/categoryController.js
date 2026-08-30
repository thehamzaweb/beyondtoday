const slugify = require('slugify');
const Category = require('../models/Category');

exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.json({ category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.createCategory = async (req, res) => {
  const { name, slug, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  try {
    const finalSlug =
      (slug && slug.trim()) || slugify(name, { lower: true, strict: true });

    const existing = await Category.findBySlug(finalSlug);
    if (existing) {
      return res.status(409).json({ message: 'Category with this slug already exists.' });
    }

    const id = await Category.create({ name, slug: finalSlug, description });
    const category = await Category.findById(id);
    res.status(201).json({ category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateCategory = async (req, res) => {
  const id = req.params.id;
  const { name, slug, description } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const finalSlug =
      (slug && slug.trim()) || slugify(name, { lower: true, strict: true });
    const existing = await Category.findBySlug(finalSlug);
    if (existing && existing.id !== parseInt(id, 10)) {
      return res.status(409).json({ message: 'Category with this slug already exists.' });
    }

    await Category.update(id, { name, slug: finalSlug, description });
    const updated = await Category.findById(id);
    res.json({ category: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    await Category.delete(req.params.id);
    res.json({ message: 'Category deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};
