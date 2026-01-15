import { NavLink, useLocation } from 'react-router-dom';
import { CATEGORIES } from '../../constants';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-80 bg-white/90 dark:bg-zinc-950/90 border-r border-zinc-200/70 dark:border-zinc-800/70 p-6 backdrop-blur transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-zinc-400">Explore</div>
          <div className="text-lg font-semibold text-zinc-900 dark:text-white font-display mt-2">Categories</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Close
        </button>
      </div>
      <nav className="space-y-2">
        {CATEGORIES.map((category) => {
          const isActive = location.pathname === category.path;
          return (
          <NavLink
            key={category.id}
            to={category.path}
            onClick={onClose}
            className={`group flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all ${
              isActive
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/70 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <span className="font-medium">{category.name}</span>
            <span className={`text-xs ${isActive ? 'text-white/80' : 'text-zinc-400'} group-hover:text-emerald-400`}>
              →
            </span>
          </NavLink>
        );
        })}
      </nav>
    </aside>
  );
}
