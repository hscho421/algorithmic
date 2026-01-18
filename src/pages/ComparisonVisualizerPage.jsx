import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAlgorithmsByCategory, getCategoryById } from '../data/algorithms';
import { CATEGORIES, isProCategory } from '../constants';
import ComparisonVisualizer from '../components/comparison/ComparisonVisualizer';
import useUserPreferences from '../context/useUserPreferences';

export default function ComparisonVisualizerPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { isPro } = useUserPreferences();
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const categoryData = getCategoryById(categoryId);
  const algorithms = getAlgorithmsByCategory(categoryId);
  const isLocked = isProCategory(categoryId) && !isPro;

  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [isSelecting, setIsSelecting] = useState(true);

  useEffect(() => {
    // Auto-select first 2 algorithms if available
    if (algorithms.length >= 2 && selectedAlgorithms.length === 0) {
      setSelectedAlgorithms([algorithms[0].id, algorithms[1].id]);
    }
  }, [algorithms, selectedAlgorithms.length]);

  const handleAlgorithmToggle = (algorithmId) => {
    setSelectedAlgorithms((prev) => {
      if (prev.includes(algorithmId)) {
        return prev.filter((id) => id !== algorithmId);
      }
      // Limit to 3 algorithms
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, algorithmId];
    });
  };

  const handleStartComparison = () => {
    if (selectedAlgorithms.length >= 2) {
      setIsSelecting(false);
    }
  };

  const handleBackToSelection = () => {
    setIsSelecting(true);
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
      <div className="space-y-6 font-body max-w-4xl mx-auto px-6 py-10">
        <div className="rounded-3xl border border-amber-200/80 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-500/10 p-8">
          <div className="text-xs uppercase tracking-[0.2em] text-amber-500">Pro Feature</div>
          <h1 className="text-3xl font-display text-zinc-900 dark:text-white mt-3">
            Compare {category.name} is Pro-only
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 mt-2">
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
              to={`/category/${categoryId}`}
              className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              Back to {category.name}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (algorithms.length < 2) {
    return (
      <div className="text-center py-12 space-y-4">
        <h1 className="text-2xl font-bold text-zinc-400">Not enough algorithms to compare</h1>
        <p className="text-zinc-500">This category needs at least 2 algorithms for comparison mode.</p>
        <Link to={`/category/${categoryId}`} className="text-blue-500 hover:underline inline-block">
          Back to {category.name}
        </Link>
      </div>
    );
  }

  if (isSelecting) {
    return (
      <div className="space-y-6 font-body max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to={`/category/${categoryId}`} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            {category.name}
          </Link>
          <span>/</span>
          <span className="text-zinc-700 dark:text-zinc-300">Compare</span>
        </div>

        <div>
          <h1 className="text-3xl font-display text-zinc-900 dark:text-white">
            Compare {category.name} Algorithms
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2">
            Select 2-3 algorithms to compare side-by-side
          </p>
        </div>

        <div className="space-y-3">
          {algorithms.map((algorithm) => {
            const isSelected = selectedAlgorithms.includes(algorithm.id);
            const isDisabled = !isSelected && selectedAlgorithms.length >= 3;

            return (
              <button
                key={algorithm.id}
                onClick={() => !isDisabled && handleAlgorithmToggle(algorithm.id)}
                disabled={isDisabled}
                className={`
                  w-full text-left p-5 rounded-xl border transition-all
                  ${
                    isSelected
                      ? 'border-teal-500 dark:border-teal-400 bg-teal-50 dark:bg-teal-950/30'
                      : isDisabled
                      ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 opacity-50 cursor-not-allowed'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-teal-400 dark:hover:border-teal-500'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors
                          ${
                            isSelected
                              ? 'border-teal-500 dark:border-teal-400 bg-teal-500 dark:bg-teal-400'
                              : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                          }
                        `}
                      >
                        {isSelected && (
                          <svg className="w-4 h-4 text-white dark:text-zinc-900" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        {algorithm.name}
                      </h3>
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 ml-9">
                      {algorithm.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            onClick={handleStartComparison}
            disabled={selectedAlgorithms.length < 2}
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all
              ${
                selectedAlgorithms.length >= 2
                  ? 'bg-teal-500 hover:bg-teal-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
              }
            `}
          >
            Compare {selectedAlgorithms.length} Algorithm{selectedAlgorithms.length !== 1 ? 's' : ''}
          </button>
          <Link
            to={`/category/${categoryId}`}
            className="px-6 py-3 rounded-lg font-semibold border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            Cancel
          </Link>
        </div>

        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          {selectedAlgorithms.length === 0 && '⚠️ Select at least 2 algorithms'}
          {selectedAlgorithms.length === 1 && '⚠️ Select 1 more algorithm'}
          {selectedAlgorithms.length === 3 && '✓ Maximum of 3 algorithms selected'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to={`/category/${categoryId}`} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              {category.name}
            </Link>
            <span>/</span>
            <span className="text-zinc-700 dark:text-zinc-300">Compare</span>
          </div>
          <button
            onClick={handleBackToSelection}
            className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
          >
            ← Change Selection
          </button>
        </div>
        <h1 className="text-3xl font-display text-zinc-900 dark:text-white mt-2">
          Algorithm Comparison
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">
          Comparing {selectedAlgorithms.length} algorithms side-by-side
        </p>
      </div>

      <ComparisonVisualizer
        categoryId={categoryId}
        algorithmIds={selectedAlgorithms}
      />
    </div>
  );
}
