import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-24 text-center">
      <Compass className="mb-4 h-14 w-14 text-indigo-600 dark:text-indigo-400" />
      <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">404</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        The page you are looking for does not exist.
      </p>
      <Link to="/" className="btn-primary mt-8">
        Back to Home
      </Link>
    </div>
  );
}
