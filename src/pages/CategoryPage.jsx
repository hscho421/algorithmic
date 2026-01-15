import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { getAlgorithmsByCategory, getCategoryById } from '../data/algorithms';

export default function CategoryPage() {
  const { categoryId } = useParams();
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const categoryData = getCategoryById(categoryId);
  const algorithms = getAlgorithmsByCategory(categoryId);

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
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400 opacity-80" />
        <div className="relative z-10">
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Category</div>
          <h1 className="text-3xl md:text-4xl font-display text-zinc-900 dark:text-white mt-3">{category.name}</h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-3 max-w-2xl">
            {categoryData?.description || 'Select an algorithm to visualize'}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 dark:border-zinc-700/70 bg-zinc-50/80 dark:bg-zinc-900/70 px-3 py-1 text-xs text-zinc-500 dark:text-zinc-300">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            {algorithms.length} visualizer{algorithms.length === 1 ? '' : 's'} available
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
