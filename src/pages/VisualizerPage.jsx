import { useParams, Link } from 'react-router-dom';
import { getAlgorithmById } from '../data/algorithms';
import { CATEGORIES } from '../constants';
import { BinarySearchVisualizer } from '../components/visualizers/searching';
import { MergeSortVisualizer, QuickSortVisualizer } from '../components/visualizers/sorting';
import { BSTVisualizer, TraversalVisualizer } from '../components/visualizers/trees';

const VISUALIZER_COMPONENTS = {
  'binary-search': BinarySearchVisualizer,
  'merge-sort': MergeSortVisualizer,
  'quick-sort': QuickSortVisualizer,
  'bst': BSTVisualizer,
  'tree-traversals': TraversalVisualizer,
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
        <Link to="/" className="text-blue-400 hover:underline mt-4 inline-block">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to={`/category/${algorithm.categoryId}`} className="hover:text-white transition-colors">
            {category?.name}
          </Link>
          <span>/</span>
          <span className="text-zinc-300">{algorithm.name}</span>
        </div>
        <h1 className="text-3xl font-bold text-white mt-2">{algorithm.name}</h1>
        <p className="text-zinc-400 mt-1">{algorithm.description}</p>
      </div>

      <VisualizerComponent />
    </div>
  );
}