import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
          DSA Visualizer
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-4 text-lg max-w-2xl mx-auto">
          Interactive step-by-step visualizations of data structures and algorithms. 
          Learn by watching, not just reading.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to={category.path}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group"
          >
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {category.name}
            </h2>
            <p className="text-zinc-500 mt-2 text-sm">
              Explore {category.name.toLowerCase()} algorithms
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}