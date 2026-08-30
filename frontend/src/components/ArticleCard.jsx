import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDate, readingTimeText } from '../utils/format';

export default function ArticleCard({ article }) {
  const image = article.featured_image || 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/articles/${article.slug}`} className="block overflow-hidden">
        <img
          src={image}
          alt={article.title}
          loading="lazy"
          className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {article.category_name && (
          <Link
            to={`/categories/${article.category_slug}`}
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400"
          >
            {article.category_name}
          </Link>
        )}

        <Link to={`/articles/${article.slug}`}>
          <h3 className="mb-2 text-lg font-bold leading-snug text-gray-900 transition group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
            {article.title}
          </h3>
        </Link>

        <p className="mb-4 line-clamp-3 flex-1 text-sm text-gray-600 dark:text-gray-400">
          {article.excerpt}
        </p>

        <div className="mb-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(article.published_at || article.created_at)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {readingTimeText(article.reading_time)}
          </span>
        </div>

        <Link
          to={`/articles/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:gap-2.5 dark:text-indigo-400"
        >
          Read More
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
