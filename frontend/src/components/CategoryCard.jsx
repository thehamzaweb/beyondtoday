import { Link } from 'react-router-dom';
import { FolderOpen, ArrowRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="card group flex flex-col gap-3 p-6 transition hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <FolderOpen className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          {category.article_count} {Number(category.article_count) === 1 ? 'article' : 'articles'}
        </span>
      </div>

      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
        {category.name}
      </h3>

      {category.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
      )}

      <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-indigo-600 group-hover:gap-2.5 dark:text-indigo-400">
        View articles
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
