import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Loading from '../components/Loading';
import { articleService, categoryService } from '../services';

const base = 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8';

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function AdminArticleFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: base,
    category_id: '',
    reading_time: '',
    status: 'draft',
  });

  useEffect(() => {
    categoryService
      .getAll()
      .then((r) => setCategories(r.data.categories))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    articleService
      .getArticles({ limit: 100 })
      .then((r) => {
        const target = r.data.articles.find((a) => String(a.id) === String(id));
        if (target) {
          setForm({
            title: target.title || '',
            slug: target.slug || '',
            excerpt: target.excerpt || '',
            content: target.content || '',
            featured_image: target.featured_image || base,
            category_id: target.category_id ?? '',
            reading_time: target.reading_time ?? '',
            status: target.status || 'draft',
          });
        } else {
          setError('Article not found.');
        }
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load article.'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !isEdit ? { slug: slugify(value) } : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = {
        ...form,
        category_id: form.category_id ? Number(form.category_id) : null,
        slug: form.slug || slugify(form.title),
      };
      if (isEdit) {
        await articleService.update(id, data);
      } else {
        await articleService.create(data);
      }
      navigate('/admin/articles');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save article.');
      setSaving(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/admin/articles"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Articles
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        {isEdit ? 'Edit Article' : 'New Article'}
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="input"
            required
          />
        </div>

        <div>
          <label className="label" htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="input"
            placeholder="auto-generated-from-title"
          />
        </div>

        <div>
          <label className="label" htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={form.excerpt}
            onChange={handleChange}
            rows={3}
            className="input"
            placeholder="Short summary shown on cards..."
          />
        </div>

        <div>
          <label className="label" htmlFor="content">Content (HTML) *</label>
          <textarea
            id="content"
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={12}
            className="input font-mono text-xs leading-relaxed"
            placeholder="<p>Write your article here...</p>"
            required
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Supports HTML headings, paragraphs, lists, links, images, blockquotes and code blocks.
          </p>
        </div>

        <div>
          <label className="label" htmlFor="featured_image">Featured Image URL</label>
          <input
            id="featured_image"
            name="featured_image"
            value={form.featured_image}
            onChange={handleChange}
            className="input"
            placeholder="https://..."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="category_id">Category</label>
            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label" htmlFor="reading_time">Reading Time (min)</label>
            <input
              id="reading_time"
              name="reading_time"
              type="number"
              min="1"
              value={form.reading_time}
              onChange={handleChange}
              className="input"
              placeholder="auto"
            />
          </div>

          <div>
            <label className="label" htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="input"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link to="/admin/articles" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
