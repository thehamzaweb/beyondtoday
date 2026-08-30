const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const protect = require('../middleware/auth');

router.get('/', articleController.listArticles);
router.get('/latest', articleController.getLatestArticles);
router.get('/stats', protect, articleController.getStats);
router.get('/:slug', articleController.getArticleBySlug);
router.get('/:slug/related', articleController.getRelatedArticles);

router.post('/', protect, articleController.createArticle);
router.put('/:id', protect, articleController.updateArticle);
router.delete('/:id', protect, articleController.deleteArticle);

module.exports = router;
