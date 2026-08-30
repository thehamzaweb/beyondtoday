import api from './api';

export const articleService = {
  getArticles(params = {}) {
    return api.get('/articles', { params });
  },
  getLatest(limit = 6) {
    return api.get('/articles/latest', { params: { limit } });
  },
  getBySlug(slug) {
    return api.get(`/articles/${slug}`);
  },
  getRelated(slug) {
    return api.get(`/articles/${slug}/related`);
  },
  getStats() {
    return api.get('/articles/stats');
  },
  create(data) {
    return api.post('/articles', data);
  },
  update(id, data) {
    return api.put(`/articles/${id}`, data);
  },
  remove(id) {
    return api.delete(`/articles/${id}`);
  },
};

export const categoryService = {
  getAll() {
    return api.get('/categories');
  },
  getBySlug(slug) {
    return api.get(`/categories/${slug}`);
  },
  create(data) {
    return api.post('/categories', data);
  },
  update(id, data) {
    return api.put(`/categories/${id}`, data);
  },
  remove(id) {
    return api.delete(`/categories/${id}`);
  },
};

export const authService = {
  login(email, password) {
    return api.post('/auth/login', { email, password });
  },
  me() {
    return api.get('/auth/me');
  },
};
