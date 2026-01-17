import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { getAlgorithmsByCategory, getCategoryById } from '../data/algorithms';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const categoryData = getCategoryById(categoryId);
  const algorithms = getAlgorithmsByCategory(categoryId);

  const CATEGORY_STYLES = {
    searching: { accent: '#22c55e', label: 'Search' },
    sorting: { accent: '#f97316', label: 'Sort' },
    trees: { accent: '#38bdf8', label: 'Tree' },
    heaps: { accent: '#a855f7', label: 'Heap' },
    graphs: { accent: '#14b8a6', label: 'Graph' },
    'dynamic-programming': { accent: '#eab308', label: 'DP' },
    'data-structures': { accent: '#6366f1', label: 'DS' },
    strings: { accent: '#f43f5e', label: 'Str' },
    backtracking: { accent: '#10b981', label: 'BT' },
  };

  const accent = CATEGORY_STYLES[categoryId]?.accent || '#22c55e';

  const renderMotif = () => {
    switch (categoryId) {
      case 'graphs':
        return (
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <circle cx="20" cy="40" r="8" fill={accent} />
            <circle cx="60" cy="15" r="8" fill={accent} opacity="0.7" />
            <circle cx="60" cy="65" r="8" fill={accent} opacity="0.7" />
            <circle cx="100" cy="40" r="8" fill={accent} />
            <line x1="28" y1="40" x2="52" y2="18" stroke={accent} strokeWidth="3" />
            <line x1="28" y1="40" x2="52" y2="62" stroke={accent} strokeWidth="3" />
            <line x1="68" y1="18" x2="92" y2="40" stroke={accent} strokeWidth="3" />
            <line x1="68" y1="62" x2="92" y2="40" stroke={accent} strokeWidth="3" />
          </svg>
        );
      case 'trees':
        return (
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <circle cx="60" cy="14" r="8" fill={accent} />
            <circle cx="30" cy="44" r="8" fill={accent} opacity="0.8" />
            <circle cx="90" cy="44" r="8" fill={accent} opacity="0.8" />
            <circle cx="18" cy="68" r="7" fill={accent} opacity="0.6" />
            <circle cx="42" cy="68" r="7" fill={accent} opacity="0.6" />
            <circle cx="78" cy="68" r="7" fill={accent} opacity="0.6" />
            <circle cx="102" cy="68" r="7" fill={accent} opacity="0.6" />
            <line x1="60" y1="22" x2="34" y2="38" stroke={accent} strokeWidth="3" />
            <line x1="60" y1="22" x2="86" y2="38" stroke={accent} strokeWidth="3" />
            <line x1="30" y1="52" x2="20" y2="62" stroke={accent} strokeWidth="3" />
            <line x1="30" y1="52" x2="40" y2="62" stroke={accent} strokeWidth="3" />
            <line x1="90" y1="52" x2="80" y2="62" stroke={accent} strokeWidth="3" />
            <line x1="90" y1="52" x2="100" y2="62" stroke={accent} strokeWidth="3" />
          </svg>
        );
      case 'sorting':
        return (
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <rect x="16" y="36" width="14" height="28" rx="4" fill={accent} opacity="0.6" />
            <rect x="38" y="26" width="14" height="38" rx="4" fill={accent} opacity="0.75" />
            <rect x="60" y="16" width="14" height="48" rx="4" fill={accent} />
            <rect x="82" y="22" width="14" height="42" rx="4" fill={accent} opacity="0.85" />
          </svg>
        );
      case 'searching':
        return (
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <rect x="12" y="34" width="72" height="12" rx="6" fill={accent} opacity="0.2" />
            <circle cx="70" cy="40" r="14" stroke={accent} strokeWidth="6" fill="none" />
            <line x1="82" y1="52" x2="102" y2="70" stroke={accent} strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
      case 'heaps':
        return (
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <circle cx="60" cy="12" r="9" fill={accent} />
            <circle cx="32" cy="38" r="9" fill={accent} opacity="0.85" />
            <circle cx="88" cy="38" r="9" fill={accent} opacity="0.85" />
            <circle cx="20" cy="66" r="7" fill={accent} opacity="0.65" />
            <circle cx="44" cy="66" r="7" fill={accent} opacity="0.65" />
            <circle cx="76" cy="66" r="7" fill={accent} opacity="0.65" />
            <circle cx="100" cy="66" r="7" fill={accent} opacity="0.65" />
            <line x1="60" y1="20" x2="36" y2="30" stroke={accent} strokeWidth="3" />
            <line x1="60" y1="20" x2="84" y2="30" stroke={accent} strokeWidth="3" />
            <line x1="32" y1="46" x2="22" y2="58" stroke={accent} strokeWidth="3" />
            <line x1="32" y1="46" x2="42" y2="58" stroke={accent} strokeWidth="3" />
            <line x1="88" y1="46" x2="78" y2="58" stroke={accent} strokeWidth="3" />
            <line x1="88" y1="46" x2="98" y2="58" stroke={accent} strokeWidth="3" />
          </svg>
        );
      case 'dynamic-programming':
        return (
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <rect x="16" y="14" width="24" height="18" rx="5" fill={accent} opacity="0.7" />
            <rect x="48" y="14" width="24" height="18" rx="5" fill={accent} opacity="0.9" />
            <rect x="80" y="14" width="24" height="18" rx="5" fill={accent} opacity="0.7" />
            <rect x="16" y="40" width="24" height="18" rx="5" fill={accent} opacity="0.9" />
            <rect x="48" y="40" width="24" height="18" rx="5" fill={accent} />
            <rect x="80" y="40" width="24" height="18" rx="5" fill={accent} opacity="0.85" />
            <line x1="40" y1="23" x2="48" y2="23" stroke={accent} strokeWidth="3" />
            <line x1="72" y1="23" x2="80" y2="23" stroke={accent} strokeWidth="3" />
            <line x1="28" y1="32" x2="28" y2="40" stroke={accent} strokeWidth="3" />
            <line x1="60" y1="32" x2="60" y2="40" stroke={accent} strokeWidth="3" />
            <line x1="92" y1="32" x2="92" y2="40" stroke={accent} strokeWidth="3" />
          </svg>
        );
      case 'backtracking':
        return (
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <circle cx="26" cy="56" r="6" fill={accent} opacity="0.65" />
            <circle cx="46" cy="40" r="7" fill={accent} opacity="0.8" />
            <circle cx="66" cy="24" r="8" fill={accent} />
            <circle cx="86" cy="40" r="7" fill={accent} opacity="0.55" />
            <circle cx="106" cy="56" r="6" fill={accent} opacity="0.4" />
            {/* <path d="M26 56 L46 40 L66 24" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M66 24 L86 40 L106 56" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5" />
            <path d="M66 24 Q70 34 58 40" stroke={accent} strokeWidth="4" fill="none" strokeLinecap="round" /> */}
            {/* <polyline points="60,36 54,44 64,44" fill="none" stroke={accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /> */}
          </svg>
        );
      case 'strings':
        return (
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <rect x="12" y="20" width="96" height="20" rx="10" fill={accent} opacity="0.2" />
            <rect x="16" y="22" width="18" height="16" rx="6" fill={accent} opacity="0.9" />
            <rect x="38" y="22" width="18" height="16" rx="6" fill={accent} opacity="0.75" />
            <rect x="60" y="22" width="18" height="16" rx="6" fill={accent} opacity="0.6" />
            <rect x="82" y="22" width="18" height="16" rx="6" fill={accent} opacity="0.8" />
            <circle cx="30" cy="58" r="6" fill={accent} opacity="0.7" />
            <circle cx="60" cy="58" r="6" fill={accent} opacity="0.9" />
            <circle cx="90" cy="58" r="6" fill={accent} opacity="0.7" />
            <line x1="30" y1="40" x2="30" y2="52" stroke={accent} strokeWidth="3" />
            <line x1="60" y1="40" x2="60" y2="52" stroke={accent} strokeWidth="3" />
            <line x1="90" y1="40" x2="90" y2="52" stroke={accent} strokeWidth="3" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 120 80" className="w-full h-full">
            <circle cx="30" cy="40" r="10" fill={accent} opacity="0.7" />
            <circle cx="60" cy="40" r="10" fill={accent} opacity="0.85" />
            <circle cx="90" cy="40" r="10" fill={accent} />
          </svg>
        );
    }
  };

  if (!category) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-zinc-400">Category not found</h1>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-body">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/60 px-6 py-10 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-zinc-200/80 dark:bg-zinc-800/80" />
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-8 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Category</div>
            <h1 className="text-3xl md:text-4xl font-display text-zinc-900 dark:text-white mt-3">{category.name}</h1>
            <p className="text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl">
              {categoryData?.description || 'Select an algorithm to visualize'}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 dark:border-zinc-700/70 bg-zinc-50/80 dark:bg-zinc-900/70 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-300">
                <span className="inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
                {algorithms.length} visualizer{algorithms.length === 1 ? '' : 's'} available
              </div>
              {algorithms.length >= 2 && (
                <Link
                  to={`/compare/${categoryId}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  Compare Algorithms
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[320px] h-40 opacity-90">
              {renderMotif()}
            </div>
          </div>
        </div>
      </section>

      {algorithms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {algorithms.map((algorithm, idx) => (
            <Link
              key={algorithm.id}
              to={`/visualize/${algorithm.id}`}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-900/60 p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-black/40"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-amber-300 opacity-90" />
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Visualizer</div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mt-3 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                {algorithm.name}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">{algorithm.description}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                <span>Step-by-step</span>
                <span>Open →</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-200/70 dark:border-zinc-800/70 bg-white/60 dark:bg-zinc-900/60 p-10 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">Algorithms coming soon...</p>
        </div>
      )}
    </div>
  );
}
