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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">{category.name}</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-2">
          {categoryData?.description || 'Select an algorithm to visualize'}
        </p>
      </div>

      {algorithms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {algorithms.map((algorithm) => (
            <Link
              key={algorithm.id}
              to={`/visualize/${algorithm.id}`}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group"
            >
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {algorithm.name}
              </h2>
              <p className="text-zinc-500 mt-2 text-sm">{algorithm.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 text-center">
          <p className="text-zinc-500">Algorithms coming soon...</p>
        </div>
      )}
    </div>
  );
}