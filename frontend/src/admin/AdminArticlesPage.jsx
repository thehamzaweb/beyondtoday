import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { articleService } from '../services';
import { formatDate } from '../utils/format';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    articleService
      .getArticles({ limit: 100 })
      .then((r) => setArticles(r.data.articles))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(article) {
    if (!window.confirm(`Delete article "${article.title}"?`)) return;
    try {
      await articleService.remove(article.id);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  }

  function togglePublish(article) {
    const nextStatus = article.status === 'published' ? 'draft' : 'published';
    if (!window.confirm(`Set status to "${nextStatus}"?`)) return;
    articleService
      .update(article.id, {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        featured_image: article.featured_image,
        category_id: article.category_id,
        reading_time: article.reading_time,
        status: nextStatus,
      })
      .then(load)
      .catch((err) => alert(err.response?.data?.message || 'Update failed.'));
  }

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Articles</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Create, edit and publish your articles.</p>
        </div>
        <Link to="/admin/articles/new" className="btn-primary shrink-0">
          <Plus className="h-4 w-4" />
          New Article
        </Link>
      </div>

      {loading ? (
        <Loading />
      ) : articles.length === 0 ? (
        <EmptyState title="No articles yet" />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {articles.map((a) => (
                <tr key={a.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="max-w-xs px-6 py-4">
                    <p className="truncate font-medium text-gray-900 dark:text-gray-100">{a.title}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {a.category_name || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(a)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        a.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                      }`}
                      title="Toggle publish status"
                    >
                      {a.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {formatDate(a.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {a.status === 'published' && (
                        <Link
                          to={`/articles/${a.slug}`}
                          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      <Link
                        to={`/admin/articles/${a.id}/edit`}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(a)}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
