import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import NotFoundPage from './NotFoundPage';
import { articleService, categoryService } from '../services';

export default function CategoryArticlesPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    categoryService
      .getBySlug(slug)
      .then((res) => setCategory(res.data.category))
      .catch((err) => {
        if (err.response && err.response.status === 404) setNotFound(true);
      });

    articleService
      .getArticles({ status: 'published', category: slug, limit: 100 })
      .then((res) => setArticles(res.data.articles))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-page py-12">
        <Loading />
      </div>
    );
  }

  if (notFound) {
    return <NotFoundPage />;
  }

  return (
    <div className="container-page py-12">
      <Link
        to="/categories"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" />
        All Categories
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {category ? category.name : 'Category'}
            </h1>
            {category?.description && (
              <p className="mt-1 text-gray-600 dark:text-gray-400">{category.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
      </div>

      {articles.length === 0 ? (
        <EmptyState
          title="No articles in this category yet"
          description="Articles published in this category will show up here."
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
