import { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { categoryService } from '../services';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then((r) => setCategories(r.data.categories))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Explore articles organized by topic.
        </p>
      </div>

      {loading ? (
        <Loading />
      ) : categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Categories will appear here once added." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
