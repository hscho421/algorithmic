import { useParams, Link } from 'react-router-dom';
import { getAlgorithmById } from '../data/algorithms';
import { CATEGORIES, isProCategory } from '../constants';
import { BinarySearchVisualizer, SlidingWindowVisualizer } from '../components/visualizers/searching';
import { MergeSortVisualizer, QuickSortVisualizer, HeapSortVisualizer } from '../components/visualizers/sorting';
import { BSTVisualizer, TraversalVisualizer } from '../components/visualizers/trees';
import { MinHeapVisualizer } from '../components/visualizers/heaps';
import { TrieVisualizer } from '../components/visualizers/strings';
import { BFSVisualizer, DFSVisualizer, DijkstraVisualizer, TopologicalSortVisualizer, UnionFindVisualizer } from '../components/visualizers/graphs';
import { FibonacciVisualizer, CoinChangeVisualizer, LCSVisualizer, KnapsackVisualizer } from '../components/visualizers/dynamic-programming';
import useUserPreferences from '../context/useUserPreferences';

const VISUALIZER_COMPONENTS = {
  'binary-search': BinarySearchVisualizer,
  'sliding-window': SlidingWindowVisualizer,
  'merge-sort': MergeSortVisualizer,
  'quick-sort': QuickSortVisualizer,
  'heap-sort': HeapSortVisualizer,
  'bst': BSTVisualizer,
  'tree-traversals': TraversalVisualizer,
  'min-heap': MinHeapVisualizer,
  'trie': TrieVisualizer,
  'bfs': BFSVisualizer,
  'dfs': DFSVisualizer,
  'dijkstra': DijkstraVisualizer,
  'topological-sort': TopologicalSortVisualizer,
  'union-find': UnionFindVisualizer,
  'fibonacci': FibonacciVisualizer,
  'coin-change': CoinChangeVisualizer,
  'lcs': LCSVisualizer,
  'knapsack': KnapsackVisualizer,
};

export default function VisualizerPage() {
  const { algorithmId } = useParams();
  const { isPro } = useUserPreferences();
  const algorithm = getAlgorithmById(algorithmId);
  const category = algorithm ? CATEGORIES.find((c) => c.id === algorithm.categoryId) : null;
  const isLocked = algorithm && isProCategory(algorithm.categoryId) && !isPro;

  const VisualizerComponent = VISUALIZER_COMPONENTS[algorithmId];

  if (!algorithm || !VisualizerComponent) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-zinc-400">Visualizer not found</h1>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Go home
        </Link>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="space-y-6 font-body">
        <div className="max-w-3xl mx-auto px-6">
          <div className="rounded-3xl border border-amber-200/80 dark:border-amber-500/40 bg-amber-50/70 dark:bg-amber-500/10 p-8">
            <div className="text-xs uppercase tracking-[0.2em] text-amber-500">Pro Visualizer</div>
            <h1 className="text-3xl font-display text-zinc-900 dark:text-white mt-3">
              {algorithm.name} is part of Pro
            </h1>
            <p className="text-zinc-600 dark:text-zinc-300 mt-2">
              Upgrade to unlock advanced visualizers, checkpoint history, and unlimited saved inputs.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
              >
                View Pro plans →
              </Link>
              <Link
                to={`/category/${algorithm.categoryId}`}
                className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                Back to {category?.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-body">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <Link to="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to={`/category/${algorithm.categoryId}`} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
            {category?.name}
          </Link>
          <span>/</span>
          <span className="text-zinc-700 dark:text-zinc-300">{algorithm.name}</span>
        </div>
        <h1 className="text-3xl font-display text-zinc-900 dark:text-white mt-2">{algorithm.name}</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mt-1">{algorithm.description}</p>
      </div>

      <VisualizerComponent />
    </div>
  );
}
