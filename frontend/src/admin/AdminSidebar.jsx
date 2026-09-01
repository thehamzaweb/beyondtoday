import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, FolderOpen, LogOut } from 'lucide-react';

const items = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/articles', label: 'Articles', icon: FileText },
  { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
];

export default function AdminSidebar({ onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate('/admin/login');
  }

  return (
    <aside className="w-full shrink-0 border-b border-gray-200 bg-white lg:w-60 lg:border-b-0 lg:border-r lg:dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3 border-b border-gray-200 p-4 lg:h-16 dark:border-gray-800">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">BT</span>
        <div>
          <p className="text-sm font-bold leading-tight text-gray-900 dark:text-white">Beyond Today</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex overflow-x-auto p-2 lg:flex-col lg:overflow-visible">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition lg:mb-1 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 lg:mt-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
