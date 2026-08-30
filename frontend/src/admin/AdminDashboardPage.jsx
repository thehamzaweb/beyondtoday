import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, PenLine, FolderOpen, Plus, ArrowRight } from 'lucide-react';
import Loading from '../components/Loading';
import { articleService, categoryService } from '../services';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      articleService.getStats().then((r) => r.data),
      articleService.getArticles({ limit: 5 }).then((r) => r.data.articles),
    ])
      .then(([s, arts]) => {
        setStats(s);
        setRecent(arts);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  const statCards = [
    { label: 'Total Articles', value: stats?.totalArticles ?? 0, icon: FileText, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400' },
    { label: 'Published', value: stats?.publishedArticles ?? 0, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400' },
    { label: 'Drafts', value: stats?.draftArticles ?? 0, icon: PenLine, color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400' },
    { label: 'Categories', value: stats?.categories ?? 0, icon: FolderOpen, color: 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400' },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Welcome back to the admin panel.</p>
        </div>
        <Link to="/admin/articles/new" className="btn-primary shrink-0">
          <Plus className="h-4 w-4" />
          New Article
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="card p-5">
            <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 className="font-bold text-gray-900 dark:text-white">Recent Articles</h2>
          <Link
            to="/admin/articles"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            No articles yet. Create your first one.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {recent.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-800 dark:text-gray-200">{a.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.category_name || 'No category'}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    a.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                      : 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                  }`}
                >
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
