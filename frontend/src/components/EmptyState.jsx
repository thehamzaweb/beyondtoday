import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'No results found', description, icon: Icon = SearchX }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 py-16 px-6 text-center dark:border-gray-700">
      <Icon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
    </div>
  );
}
