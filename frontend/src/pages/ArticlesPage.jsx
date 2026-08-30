import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { articleService, categoryService } from '../services';

const PER_PAGE = 9;

export default function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  const [search, setSearch] = useState(searchParam);
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState(searchParam);

  useEffect(() => {
    categoryService
      .getAll()
      .then((r) => setCategories(r.data.categories))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryParam]);

  useEffect(() => {
    setLoading(true);
    articleService
      .getArticles({
        status: 'published',
        search: debouncedSearch || undefined,
        category: categoryParam || undefined,
        page,
        limit: PER_PAGE,
      })
      .then((r) => {
        setArticles(r.data.articles);
        setTotal(r.data.total);
      })
      .catch(() => {
        setArticles([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, categoryParam, page]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  function updateCategory(slug) {
    const params = new URLSearchParams(searchParams);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    setSearchParams(params);
  }

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Articles</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Browse all published articles.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <SearchBar
            value={search}
            onChange={(v) => {
              setSearch(v);
              const params = new URLSearchParams(searchParams);
              if (v) {
                params.set('search', v);
              } else {
                params.delete('search');
              }
              setSearchParams(params);
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateCategory('')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              !categoryParam
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => updateCategory(c.slug)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                categoryParam === c.slug
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : articles.length === 0 ? (
        <EmptyState
          title="No articles found"
          description="Try adjusting your search or filter to find what you are looking for."
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>
              <span className="px-3 text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
