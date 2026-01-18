import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function PageLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isVisualizer = location.pathname.startsWith('/visualize/');

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 dark:text-white">
      <Header onToggleSidebar={handleToggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close categories"
          onClick={handleCloseSidebar}
          className="fixed inset-0 z-30 bg-gradient-to-br from-zinc-900/40 via-zinc-900/20 to-zinc-900/40 backdrop-blur-sm"
        />
      )}
      <main className="py-6">
        <div className={isVisualizer ? '' : 'page-shell'}>
          <Outlet />
        </div>
      </main>
      <footer className="border-t border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-400 shadow-md shadow-emerald-500/30 inline-flex items-center justify-center">
                  <svg viewBox="0 0 256 256" className="w-full h-full" aria-hidden="true" fill="none" preserveAspectRatio="xMidYMid meet">
                    <g stroke="#FFFFFF" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M128 86 V118" />
                      <path d="M128 118 H92 V152" />
                      <path d="M128 118 H164 V152" />
                    </g>
                    <circle cx="128" cy="72" r="18" fill="#40A8A8" stroke="#FFFFFF" strokeWidth="8" />
                    <rect x="72" y="152" width="40" height="40" rx="10" fill="#40A8A8" stroke="#FFFFFF" strokeWidth="8" />
                    <rect x="144" y="152" width="40" height="40" rx="10" fill="#40A8A8" stroke="#FFFFFF" strokeWidth="8" />
                  </svg>
                </span>
                <div>
                  <div className="font-display text-lg text-zinc-900 dark:text-white">Algorithmic</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">Learn by doing</div>
                </div>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Interactive, step-by-step visualizations for mastering data structures and algorithms.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 dark:border-emerald-700/40 bg-emerald-50/70 dark:bg-emerald-900/20 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                Pro + payments coming soon
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">Explore</div>
              <div className="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Link to="/category/searching" className="block hover:text-zinc-900 dark:hover:text-white">Searching</Link>
                <Link to="/category/sorting" className="block hover:text-zinc-900 dark:hover:text-white">Sorting</Link>
                <Link to="/category/trees" className="block hover:text-zinc-900 dark:hover:text-white">Trees</Link>
                <Link to="/category/heaps" className="block hover:text-zinc-900 dark:hover:text-white">Heaps</Link>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">Product</div>
              <div className="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <Link to="/" className="block hover:text-zinc-900 dark:hover:text-white">Visualizers</Link>
                <Link to="/roadmap" className="block hover:text-zinc-900 dark:hover:text-white">Roadmap</Link>
                <Link to="/pricing" className="block hover:text-zinc-900 dark:hover:text-white">Pricing</Link>
                <span className="block text-zinc-400 dark:text-zinc-500">Changelog</span>
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-zinc-900 dark:text-white">Contact</div>
              <div className="mt-3 space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="block">support@algorithmicai.dev</span>
                <span className="block">Educators & teams</span>
                <Link to="/privacy" className="block hover:text-zinc-900 dark:hover:text-white">Privacy</Link>
                <Link to="/terms" className="block hover:text-zinc-900 dark:hover:text-white">Terms</Link>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-zinc-400 dark:text-zinc-500">
            <span>© {new Date().getFullYear()} Algorithmic. All rights reserved.</span>
            <span>Built for learners, instructors, and teams.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
