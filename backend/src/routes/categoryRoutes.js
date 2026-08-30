const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const protect = require('../middleware/auth');

router.get('/', categoryController.listCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

router.post('/', protect, categoryController.createCategory);
router.put('/:id', protect, categoryController.updateCategory);
router.delete('/:id', protect, categoryController.deleteCategory);

module.exports = router;
