import { useParams, Link } from 'react-router-dom';
import { CATEGORIES, isProCategory, isProAlgorithm } from '../constants';
import { getAlgorithmsByCategory, getCategoryById } from '../data/algorithms';
import DifficultyBadge from '../components/shared/ui/DifficultyBadge';
import useUserPreferences from '../context/useUserPreferences';

export default function CategoryPage() {
  // ... (keep existing code for CATEGORY_STYLES, accent, renderMotif, etc.)
  const { categoryId } = useParams();
  const { isPro } = useUserPreferences();
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const categoryData = getCategoryById(categoryId);
  const algorithms = getAlgorithmsByCategory(categoryId);
  const isLocked = isProCategory(categoryId) && !isPro;

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

  if (isLocked) {
    return (
      <div className="space-y-6 font-body">
        <section className="relative overflow-hidden rounded-3xl border border-amber-200/80 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-500/10 px-6 py-10 shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-amber-200/80 dark:bg-amber-500/40" />
          <div className="relative z-10">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-500">Pro Category</div>
            <h1 className="text-3xl md:text-4xl font-display text-zinc-900 dark:text-white mt-3">
              {category.name} is Pro-only
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl">
              Go Pro to unlock advanced visualizers, checkpoint history, and unlimited saved inputs.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
              >
                See Pro plans →
              </Link>
              <Link
                to="/"
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                Back to home
              </Link>
            </div>
          </div>
        </section>
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
          {algorithms.map((algorithm) => (
            <Link to={`/visualize/${algorithm.id}`} key={algorithm.id}>
              <div
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/70 bg-white/70 p-6 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800/70 dark:bg-zinc-900/60 dark:hover:shadow-black/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
                      Visualizer
                    </span>
                    <div className="flex items-center gap-2">
                      {(isProCategory(categoryId) || isProAlgorithm(algorithm.id)) && (
                        <span className="text-[10px] uppercase tracking-[0.2em] bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-full font-semibold">
                          Pro
                        </span>
                      )}
                      {algorithm.difficulty && <DifficultyBadge difficulty={algorithm.difficulty} />}
                    </div>
                  </div>
                  <h2 className="mt-3 text-xl font-semibold text-zinc-900 transition-colors group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">
                    {algorithm.name}
                  </h2>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{algorithm.description}</p>
                </div>
                <div className="mt-5">
                  <div className="flex flex-wrap gap-2">
                    {algorithm.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                    <span>Step-by-step</span>
                    <span>Open →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-200/70 bg-white/60 p-10 text-center dark:border-zinc-800/70 dark:bg-zinc-900/60">
          <p className="text-zinc-500 dark:text-zinc-400">Algorithms coming soon...</p>
        </div>
      )}
    </div>
  );
}
