import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, FolderOpen } from 'lucide-react';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import ArticleCard from '../components/ArticleCard';
import NotFoundPage from './NotFoundPage';
import { articleService } from '../services';
import { formatDate, readingTimeText } from '../utils/format';

export default function ArticleDetailsPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setArticle(null);
    setRelated([]);

    articleService
      .getBySlug(slug)
      .then((res) => {
        setArticle(res.data.article);
        return articleService.getRelated(slug).then((r) => setRelated(r.data.articles));
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-page py-12">
        <Loading />
      </div>
    );
  }

  if (notFound || !article) {
    return <NotFoundPage />;
  }

  const image =
    article.featured_image ||
    'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="container-page py-10">
      <button
        onClick={() => window.history.back()}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Articles
      </button>

      <article className="mx-auto max-w-3xl">
        <header className="mb-8">
          {article.category_name && (
            <Link
              to={`/categories/${article.category_slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400"
            >
              <FolderOpen className="h-4 w-4" />
              {article.category_name}
            </Link>
          )}
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-gray-900 dark:text-white sm:text-4xl">
            {article.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(article.published_at || article.created_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {readingTimeText(article.reading_time)}
            </span>
          </div>
        </header>

        <img
          src={image}
          alt={article.title}
          className="mb-8 w-full rounded-xl object-cover"
          style={{ maxHeight: '420px' }}
        />

        {article.excerpt && (
          <p className="mb-6 text-lg font-medium leading-relaxed text-gray-600 dark:text-gray-300">
            {article.excerpt}
          </p>
        )}

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl border-t border-gray-200 pt-10 dark:border-gray-800">
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
            Related Articles
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
