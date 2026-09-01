import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Rss } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Link to="/" className="mb-3 flex items-center gap-2 text-lg font-extrabold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              BT
            </span>
            <span className="text-gray-900 dark:text-white">
              Beyond <span className="text-indigo-600 dark:text-indigo-400">Today</span>
            </span>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            A simple technology blog sharing useful knowledge about programming, software
            development, cybersecurity, AI, networking, and IT.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">Home</Link></li>
            <li><Link to="/articles" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">Articles</Link></li>
            <li><Link to="/categories" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">Categories</Link></li>
            <li><Link to="/about" className="text-gray-600 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">About</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
            Follow
          </h4>
          <div className="flex gap-3">
            <a href="#" aria-label="GitHub" className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Twitter" className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" aria-label="LinkedIn" className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" aria-label="RSS" className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white">
              <Rss className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-500">
            Learn. Build. Become Better.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 py-6 dark:border-gray-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} Beyond Today. All rights reserved.</p>
       </div>
      </div>
    </footer>
  );
}
