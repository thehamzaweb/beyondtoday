import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './admin/AdminLayout';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailsPage from './pages/ArticleDetailsPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryArticlesPage from './pages/CategoryArticlesPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './admin/AdminLoginPage';
import AdminDashboardPage from './admin/AdminDashboardPage';
import AdminArticlesPage from './admin/AdminArticlesPage';
import AdminArticleFormPage from './admin/AdminArticleFormPage';
import AdminCategoriesPage from './admin/AdminCategoriesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<CategoryArticlesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="articles/new" element={<AdminArticleFormPage />} />
          <Route path="articles/:id/edit" element={<AdminArticleFormPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
