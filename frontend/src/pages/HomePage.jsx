import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Rocket } from 'lucide-react';
import ArticleCard from '../components/ArticleCard';
import CategoryCard from '../components/CategoryCard';
import Loading from '../components/Loading';
import { articleService, categoryService } from '../services';

const fallbackCategories = [
  'Programming',
  'Web Development',
  'Backend',
  'Frontend',
  'Cybersecurity',
  'Networking',
  'AI',
  'Databases',
];

export default function HomePage() {
  const [latest, setLatest] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      articleService.getLatest(6).then((r) => r.data.articles),
      categoryService.getAll().then((r) => r.data.categories),
    ])
      .then(([arts, cats]) => {
        setLatest(arts);
        setCategories(cats);
      })
      .catch(() => {
        setCategories(fallbackCategories.map((name, i) => ({ name, article_count: 0 })));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="border-b border-gray-200 bg-gradient-to-b from-indigo-50 to-transparent py-16 sm:py-24 dark:border-gray-800 dark:from-indigo-950/30">
        <div className="container-page text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Rocket className="h-4 w-4" />
            Learn. Build. Become Better.
          </span>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            The Next{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Version
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            A simple technology blog sharing useful knowledge about programming, software
            development, cybersecurity, AI, networking, and IT.
          </p>
          <div className="mt-8">
            <Link to="/articles" className="btn-primary">
              Explore Articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Latest Articles
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                Fresh insights and tutorials from the blog.
              </p>
            </div>
            <Link
              to="/articles"
              className="hidden items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:gap-2.5 dark:text-indigo-400 sm:inline-flex"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <Loading />
          ) : latest.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No articles yet. Check back soon.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link to="/articles" className="btn-secondary">
              View all articles
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-12 sm:py-16 dark:bg-gray-900">
        <div className="container-page">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Explore Categories
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Browse articles by topic.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id || category.name} category={category} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
