import { useParams, Link } from 'react-router-dom';
import { getAlgorithmById } from '../data/algorithms';
import { CATEGORIES } from '../constants';
import { BinarySearchVisualizer, SlidingWindowVisualizer } from '../components/visualizers/searching';
import { MergeSortVisualizer, QuickSortVisualizer, HeapSortVisualizer } from '../components/visualizers/sorting';
import { BSTVisualizer, TraversalVisualizer } from '../components/visualizers/trees';
import { MinHeapVisualizer } from '../components/visualizers/heaps';
import { TrieVisualizer } from '../components/visualizers/strings';
import { BFSVisualizer, DFSVisualizer, DijkstraVisualizer, TopologicalSortVisualizer, UnionFindVisualizer } from '../components/visualizers/graphs';
import { FibonacciVisualizer, CoinChangeVisualizer, LCSVisualizer, KnapsackVisualizer } from '../components/visualizers/dynamic-programming';

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
  const algorithm = getAlgorithmById(algorithmId);
  const category = algorithm ? CATEGORIES.find((c) => c.id === algorithm.categoryId) : null;

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
