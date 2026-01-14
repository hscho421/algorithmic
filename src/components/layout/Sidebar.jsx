import { NavLink } from 'react-router-dom';
import { CATEGORIES } from '../../constants';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 min-h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-1">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3 py-2">
          Categories
        </div>
        {CATEGORIES.map((category) => (
          <NavLink
            key={category.id}
            to={category.path}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
              }`
            }
          >
            {category.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}