import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeContext } from '../../context/useThemeContext';
import { ALGORITHMS } from '../../data/algorithms';

export default function Header({ onToggleSidebar }) {
  const { theme, toggleTheme } = useThemeContext();
  const [query, setQuery] = useState('');

  const allAlgorithms = useMemo(() => {
    const list = [];
    Object.values(ALGORITHMS).forEach((category) => {
      category.algorithms.forEach((algorithm) => {
        list.push({
          id: algorithm.id,
          name: algorithm.name,
          description: algorithm.description,
          category: category.name,
        });
      });
    });
    return list;
  }, []);

  const results = query.trim()
    ? allAlgorithms.filter((algorithm) =>
        `${algorithm.name} ${algorithm.description} ${algorithm.category}`
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      )
    : [];

  return (
    <header className="bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 via-emerald-500 to-amber-400 rounded-2xl shadow-md shadow-emerald-500/30" />
            <span className="text-xl font-semibold text-zinc-900 dark:text-white font-display">DSA Visualizer</span>
          </Link>

          <nav className="flex items-center gap-3">
            <div className="hidden lg:flex relative">
              <div className="flex items-center gap-2 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 bg-white/80 dark:bg-zinc-900/70 px-3 py-1.5 text-sm text-zinc-500 dark:text-zinc-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search visualizers..."
                  className="bg-transparent focus:outline-none placeholder:text-zinc-400 min-w-[220px]"
                />
              </div>
              {query.trim() && (
                <div className="absolute top-full mt-2 w-full min-w-[320px] rounded-2xl border border-zinc-200/70 dark:border-zinc-700/70 bg-white/95 dark:bg-zinc-950/95 shadow-xl shadow-zinc-200/60 dark:shadow-black/40 p-2 z-50">
                  {results.length > 0 ? (
                    results.slice(0, 6).map((algorithm) => (
                      <Link
                        key={algorithm.id}
                        to={`/visualize/${algorithm.id}`}
                        onClick={() => setQuery('')}
                        className="block rounded-xl px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-colors"
                      >
                        <div className="font-medium">{algorithm.name}</div>
                        <div className="text-xs text-zinc-400 mt-1">{algorithm.category}</div>
                      </Link>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400">No matches</div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onToggleSidebar}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 bg-white/80 dark:bg-zinc-900/70 text-zinc-700 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
            >
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-gradient-to-tr from-teal-400 to-amber-400" />
              Categories
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-zinc-200/70 dark:border-zinc-700/70 bg-white/80 dark:bg-zinc-900/70 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/>
                  <path d="M12 2v2"/>
                  <path d="M12 20v2"/>
                  <path d="m4.93 4.93 1.41 1.41"/>
                  <path d="m17.66 17.66 1.41 1.41"/>
                  <path d="M2 12h2"/>
                  <path d="M20 12h2"/>
                  <path d="m6.34 17.66-1.41 1.41"/>
                  <path d="m19.07 4.93-1.41 1.41"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                </svg>
              )}
            </button>
            
          </nav>
        </div>
      </div>
    </header>
  );
}
