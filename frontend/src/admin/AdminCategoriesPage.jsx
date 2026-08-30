import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { categoryService } from '../services';

const emptyForm = { name: '', slug: '', description: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    categoryService
      .getAll()
      .then((r) => setCategories(r.data.categories))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function slugify(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
  }

  function startCreate() {
    setEditing(null);
    setForm(emptyForm);
    setError('');
  }

  function startEdit(category) {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setError('');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'name' && !editing ? { slug: slugify(value) } : {}),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const data = { ...form, slug: form.slug || slugify(form.name) };
      if (editing) {
        await categoryService.update(editing.id, data);
      } else {
        await categoryService.create(data);
      }
      setForm(emptyForm);
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await categoryService.remove(category.id);
      if (editing?.id === category.id) {
        setEditing(null);
        setForm(emptyForm);
      }
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Organize your articles into categories.</p>
        </div>
        {!editing && (
          <button onClick={startCreate} className="btn-primary shrink-0">
            <Plus className="h-4 w-4" />
            New Category
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className={editing ? 'lg:col-span-3' : ''}>
          {loading ? (
            <Loading />
          ) : categories.length === 0 ? (
            <EmptyState title="No categories yet" />
          ) : (
            <div className="space-y-3">
              {categories.map((c) => (
                <div key={c.id} className="card flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">{c.name}</p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      /{c.slug} · {c.article_count} {Number(c.article_count) === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => startEdit(c)}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {(editing || categories.length > 0) && (
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card space-y-4 p-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {editing ? 'Edit Category' : 'New Category'}
                </h2>
                {editing && (
                  <button
                    type="button"
                    onClick={startCreate}
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
                  {error}
                </div>
              )}

              <div>
                <label className="label" htmlFor="c-name">Name *</label>
                <input
                  id="c-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label" htmlFor="c-slug">Slug</label>
                <input
                  id="c-slug"
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="label" htmlFor="c-desc">Description</label>
                <textarea
                  id="c-desc"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="input"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
                  {saving ? 'Saving...' : editing ? 'Update Category' : 'Create Category'}
                </button>
                {editing && (
                  <button type="button" onClick={startCreate} className="btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
