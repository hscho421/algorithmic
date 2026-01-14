import { Link } from 'react-router-dom';
import { useThemeContext } from '../../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-emerald-500 to-amber-500 rounded-lg" />
            <span className="text-xl font-bold text-zinc-900 dark:text-white">DSA Visualizer</span>
          </Link>
          
          <nav className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
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
            
            <Link to="/" className="hidden md:block text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <a 
              href="https://github.com/hscho421/dsa-visualizer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:block text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}