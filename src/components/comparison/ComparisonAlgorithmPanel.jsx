import { useState, useCallback, useEffect, useRef } from 'react';
import { Input, Select } from '../shared/ui';

// Import all algorithm modules
import * as mergeSort from '../../lib/algorithms/sorting/mergeSort';
import * as quickSort from '../../lib/algorithms/sorting/quickSort';
import * as heapSort from '../../lib/algorithms/sorting/heapSort';
import * as binarySearch from '../../lib/algorithms/searching/binarySearch';
import * as slidingWindow from '../../lib/algorithms/searching/slidingWindow';
import * as bst from '../../lib/algorithms/trees/bst';
import * as traversals from '../../lib/algorithms/trees/traversals';
import * as minHeap from '../../lib/algorithms/heaps/minHeap';
import * as trie from '../../lib/algorithms/strings/trie';
import * as bfs from '../../lib/algorithms/graphs/bfs';
import * as dfs from '../../lib/algorithms/graphs/dfs';
import * as dijkstra from '../../lib/algorithms/graphs/dijkstra';
import * as topologicalSort from '../../lib/algorithms/graphs/topologicalSort';
import * as unionFind from '../../lib/algorithms/graphs/unionFind';
import * as fibonacci from '../../lib/algorithms/dp/fibonacci';
import * as coinChange from '../../lib/algorithms/dp/coinChange';
import * as lcs from '../../lib/algorithms/dp/lcs';
import * as knapsack from '../../lib/algorithms/dp/knapsack';

// Import visualization components
import SortingArrayVisualization from '../visualizers/sorting/SortingArrayVisualization';
import ArrayVisualization from '../visualizers/searching/ArrayVisualization';
import SlidingWindowVisualization from '../visualizers/searching/SlidingWindowVisualization';
import GraphDisplay from '../shared/visualization/GraphDisplay';
import TreeDisplay from '../shared/visualization/TreeDisplay';
import TrieDisplay from '../shared/visualization/TrieDisplay';
import UnionFindDisplay from '../shared/visualization/UnionFindDisplay';
import { DPTable1D, DPTable2D } from '../visualizers/dynamic-programming/DPTableVisualization';

// Import graph utilities
import { createGraph, PRESET_GRAPHS, WEIGHTED_GRAPHS, DAG_GRAPHS } from '../../lib/dataStructures/Graph';

const ALGORITHM_MODULES = {
  // Sorting
  'merge-sort': mergeSort,
  'quick-sort': quickSort,
  'heap-sort': heapSort,
  // Searching
  'binary-search': binarySearch,
  'sliding-window': slidingWindow,
  // Trees
  'bst': bst,
  'tree-traversals': traversals,
  // Heaps
  'min-heap': minHeap,
  // Strings
  'trie': trie,
  // Graphs
  'bfs': bfs,
  'dfs': dfs,
  'dijkstra': dijkstra,
  'topological-sort': topologicalSort,
  'union-find': unionFind,
  // Dynamic Programming
  'fibonacci': fibonacci,
  'coin-change': coinChange,
  'lcs': lcs,
  'knapsack': knapsack,
};

// Simple wrapper for DP visualizations
const DPVisualization = ({ state }) => {
  // Determine if 1D or 2D based on state structure
  if (state.dp && Array.isArray(state.dp[0])) {
    // 2D table
    return (
      <DPTable2D
        dp={state.dp}
        highlightCell={state.highlightCell}
        comparing={state.comparing || []}
        rowLabel={state.rowLabel || 'i'}
        colLabel={state.colLabel || 'j'}
      />
    );
  } else if (state.dp) {
    // 1D table
    return (
      <DPTable1D
        dp={state.dp}
        highlightIndex={state.highlightIndex}
        comparing={state.comparing || []}
        label="dp"
      />
    );
  }
  return <div className="text-sm text-zinc-500">No DP table to display</div>;
};

const HeapArrayDisplay = ({ heap, highlights = [], phase }) => {
  if (!heap || heap.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-zinc-500 italic">
        Empty heap — add values to visualize
      </div>
    );
  }

  const getHighlightType = (index) => {
    const highlight = highlights.find((item) => item.index === index);
    return highlight?.type || 'default';
  };

  const isSwapPhase = phase === 'swap';
  const swapHighlights = isSwapPhase ? highlights.filter((item) => item.type === 'swap') : [];
  const swapIndices = swapHighlights.map((item) => item.index);
  const cellSize = 48;
  const cellGap = 8;
  const swapDistance = cellSize + cellGap;

  const getCellStyle = (type) => {
    switch (type) {
      case 'new':
        return 'bg-emerald-500 text-white border-emerald-300';
      case 'compare':
        return 'bg-amber-500 text-white border-amber-300';
      case 'swap':
        return 'bg-rose-500 text-white border-rose-300';
      case 'root':
      case 'current':
        return 'bg-blue-500 text-white border-blue-300';
      case 'settled':
        return 'bg-zinc-700 text-zinc-200 border-zinc-500';
      default:
        return 'bg-zinc-900 text-zinc-200 border-zinc-700';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {heap.map((value, index) => {
        const type = getHighlightType(index);
        const shouldSlide = isSwapPhase && swapIndices.length === 2 && swapIndices.includes(index);
        const otherIndex = shouldSlide ? swapIndices.find((idx) => idx !== index) : null;
        const offset = shouldSlide && otherIndex !== null
          ? (otherIndex - index) * swapDistance
          : 0;
        return (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-lg border font-mono text-sm transition-colors duration-300 ${getCellStyle(type)} ${shouldSlide ? 'heap-swap-slide' : ''}`}
              style={shouldSlide ? { '--swap-offset': `${offset}px` } : undefined}
            >
              {value}
            </div>
            <div className="text-xs text-zinc-500 mt-1 font-mono">[{index}]</div>
          </div>
        );
      })}
    </div>
  );
};

const MinHeapVisualization = ({ state }) => {
  if (!state) return null;
  return (
    <div className="w-full space-y-4">
      <div className="min-h-[260px]">
        <TreeDisplay
          tree={state.tree}
          highlightedNodes={state.highlightedNodes}
          activeNode={state.activeNode}
          animationKey={state.stepIndex}
        />
      </div>
      <HeapArrayDisplay heap={state.heap} highlights={state.highlights} phase={state.phase} />
    </div>
  );
};

const renderVisualization = (algorithmId, state) => {
  switch (algorithmId) {
    case 'merge-sort':
    case 'quick-sort':
    case 'heap-sort':
      return <SortingArrayVisualization state={state} />;
    case 'binary-search':
      return <ArrayVisualization state={state} />;
    case 'sliding-window':
      return <SlidingWindowVisualization state={state} />;
    case 'bfs':
    case 'dfs':
    case 'dijkstra':
    case 'topological-sort':
      return <GraphDisplay {...state} />;
    case 'union-find':
      return <UnionFindDisplay {...state} />;
    case 'bst':
    case 'tree-traversals':
      return (
        <TreeDisplay
          tree={state.tree}
          highlightedNodes={state.highlightedNodes}
          activeNode={state.activeNode}
          queue={state.queue}
          animationKey={state.stepIndex}
        />
      );
    case 'trie':
      return (
        <TrieDisplay
          nodes={state.nodes}
          edges={state.edges}
          highlightedNodes={state.highlightedNodes}
          activeNode={state.activeNode}
        />
      );
    case 'min-heap':
      return <MinHeapVisualization state={state} />;
    case 'fibonacci':
    case 'coin-change':
    case 'lcs':
    case 'knapsack':
      return <DPVisualization state={state} />;
    default:
      return null;
  }
};

export default function ComparisonAlgorithmPanel({
  algorithm,
  registerVisualizer,
  updateState,
}) {
  const algorithmModule = ALGORITHM_MODULES[algorithm.id];

  // Dynamic input state based on algorithm
  const [inputs, setInputs] = useState(() => getDefaultInputs(algorithm.id));
  const [state, setState] = useState(null);
  const [history, setHistory] = useState([]);
  const isInitialMount = useRef(true);

  const reset = useCallback(() => {
    if (!algorithmModule) return;

    const parsedInput = parseInputForAlgorithm(algorithm.id, inputs);
    const newState = algorithmModule.initialState(parsedInput);
    setState(newState);
    setHistory([newState]);

    updateState({
      canStep: !newState.done,
      canBack: false,
      isDone: newState.done,
      stepCount: 0,
      comparisons: newState.comparisons || 0,
      state: newState,
      timeComplexity: algorithmModule.complexity?.time || 'N/A',
      spaceComplexity: algorithmModule.complexity?.space || 'N/A',
    });
  }, [algorithmModule, algorithm.id, inputs, updateState]);

  const step = useCallback(() => {
    if (!state || state.done || !algorithmModule) return false;

    const newState = algorithmModule.executeStep(state);
    setState(newState);
    setHistory((prev) => [...prev, newState]);

    updateState({
      canStep: !newState.done,
      canBack: true,
      isDone: newState.done,
      stepCount: history.length + 1,
      comparisons: newState.comparisons || 0,
      state: newState,
    });

    return !newState.done;
  }, [state, algorithmModule, history.length, updateState]);

  const back = useCallback(() => {
    if (history.length <= 1) return false;

    const newHistory = history.slice(0, -1);
    const prevState = newHistory[newHistory.length - 1];
    setHistory(newHistory);
    setState(prevState);

    updateState({
      canStep: !prevState.done,
      canBack: newHistory.length > 1,
      isDone: prevState.done,
      stepCount: newHistory.length - 1,
      comparisons: prevState.comparisons || 0,
      state: prevState,
    });

    return true;
  }, [history, updateState]);

  const canStep = useCallback(() => {
    return state && !state.done;
  }, [state]);

  const canBack = useCallback(() => {
    return history.length > 1;
  }, [history]);

  useEffect(() => {
    registerVisualizer({
      step,
      back,
      reset,
      canStep,
      canBack,
    });
  }, [step, back, reset, canStep, canBack, registerVisualizer]);

  useEffect(() => {
    reset();
  }, []);

  const handleInputChange = useCallback((key, value) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleRandomize = useCallback(() => {
    const randomInputs = generateRandomInputs(algorithm.id);
    setInputs(randomInputs);

    setTimeout(() => {
      const parsedInput = parseInputForAlgorithm(algorithm.id, randomInputs);
      const newState = algorithmModule.initialState(parsedInput);
      setState(newState);
      setHistory([newState]);
      updateState({
        canStep: !newState.done,
        canBack: false,
        isDone: newState.done,
        stepCount: 0,
        comparisons: newState.comparisons || 0,
        state: newState,
      });
    }, 0);
  }, [algorithm.id, algorithmModule, updateState]);

  // Auto-reset when inputs change (skip initial mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!algorithmModule) return;

    const parsedInput = parseInputForAlgorithm(algorithm.id, inputs);
    const newState = algorithmModule.initialState(parsedInput);
    setState(newState);
    setHistory([newState]);
    updateState({
      canStep: !newState.done,
      canBack: false,
      isDone: newState.done,
      stepCount: 0,
      comparisons: newState.comparisons || 0,
      state: newState,
      timeComplexity: algorithmModule.complexity?.time || 'N/A',
      spaceComplexity: algorithmModule.complexity?.space || 'N/A',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs]);

  if (!algorithmModule) {
    return (
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-white dark:bg-zinc-900">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
          {algorithm.name}
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400">
          Comparison mode not yet supported for this algorithm
        </p>
      </div>
    );
  }

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
          {algorithm.name}
        </h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Input controls */}
        <div className="space-y-2">
          {renderInputFields(algorithm.id, inputs, handleInputChange)}
          <button
            onClick={handleRandomize}
            className="px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
          >
            Randomize
          </button>
        </div>

        {/* Visualization */}
        {state && (
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900/50 min-h-[200px] flex items-center justify-center">
            <div className="w-full max-w-2xl">
              {renderVisualization(algorithm.id, state)}
            </div>
          </div>
        )}

        {/* State info */}
        {state && (
          <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400">
            {state.comparisons !== undefined && (
              <div className="flex justify-between">
                <span>Comparisons:</span>
                <span className="font-mono font-medium">{state.comparisons}</span>
              </div>
            )}
            {state.writes !== undefined && (
              <div className="flex justify-between">
                <span>Writes:</span>
                <span className="font-mono font-medium">{state.writes}</span>
              </div>
            )}
            {state.phase && (
              <div className="flex justify-between">
                <span>Phase:</span>
                <span className="font-medium">{state.phase}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions
function getDefaultInputs(algorithmId) {
  const defaults = {
    // Sorting
    'merge-sort': { array: '38, 27, 43, 3, 9, 82, 10' },
    'quick-sort': { array: '38, 27, 43, 3, 9, 82, 10' },
    'heap-sort': { array: '38, 27, 43, 3, 9, 82, 10' },
    // Searching
    'binary-search': { array: '1, 3, 5, 7, 9, 11, 13', target: '7', templateKey: 'exact_search' },
    'sliding-window': { array: '2, 1, 5, 1, 3, 2', k: '3', mode: 'fixed_max_sum' },
    // Trees
    'bst': { values: '50, 30, 70, 20, 40, 60, 80', operation: 'insert' },
    'tree-traversals': { tree: '1, 2, 3, 4, 5, 6, 7', mode: 'inorder' },
    // Heaps
    'min-heap': { array: '4, 10, 3, 5, 1', operation: 'heapify' },
    // Strings
    'trie': { words: 'cat, car, card, dog', search: 'car' },
    // Graphs - use preset
    'bfs': { preset: 'simple', startNode: 'A' },
    'dfs': { preset: 'simple', startNode: 'A' },
    'dijkstra': { preset: 'simple', startNode: 'A' },
    'topological-sort': { preset: 'simpleDAG', startNode: 'A' },
    'union-find': { preset: 'simple' },
    // DP
    'fibonacci': { n: '7', mode: 'tabulation' },
    'coin-change': { coins: '1, 2, 5', amount: '11', mode: 'minCoins' },
    'lcs': { str1: 'AGGTAB', str2: 'GXTXAYB' },
    'knapsack': { weights: '1, 3, 4, 5', values: '1, 4, 5, 7', capacity: '7' },
  };
  return defaults[algorithmId] || { array: '5, 2, 8, 1, 9' };
}

function parseInputForAlgorithm(algorithmId, inputs) {
  const parseArray = (str) => str.replace(/,/g, ' ').split(/\s+/).filter(Boolean).map(Number).filter((n) => !isNaN(n));

  switch (algorithmId) {
    case 'merge-sort':
    case 'quick-sort':
    case 'heap-sort':
      return { array: parseArray(inputs.array) };
    case 'binary-search':
      return { array: parseArray(inputs.array), target: Number(inputs.target), templateKey: inputs.templateKey || 'exact_search' };
    case 'sliding-window':
      return { array: parseArray(inputs.array), k: Number(inputs.k || 3), mode: inputs.mode || 'fixed_max_sum' };
    // Graph algorithms
    case 'bfs':
    case 'dfs': {
      const presetKey = inputs.preset || 'simple';
      const preset = PRESET_GRAPHS[presetKey] || PRESET_GRAPHS.simple;
      const graph = createGraph(preset.vertices, preset.edges);
      return {
        graph,
        startNode: inputs.startNode || preset.vertices[0],
        positions: preset.positions
      };
    }
    case 'dijkstra': {
      const presetKey = inputs.preset || 'simple';
      const preset = WEIGHTED_GRAPHS[presetKey] || WEIGHTED_GRAPHS.simple;
      const graph = createGraph(preset.vertices, preset.edges);
      return {
        graph,
        startNode: inputs.startNode || preset.vertices[0],
        positions: preset.positions
      };
    }
    case 'topological-sort': {
      const presetKey = inputs.preset || 'simpleDAG';
      const preset = DAG_GRAPHS[presetKey] || DAG_GRAPHS.simpleDAG;
      const graph = createGraph(preset.vertices, preset.edges);
      return {
        graph,
        positions: preset.positions
      };
    }
    case 'union-find': {
      const presetKey = inputs.preset || 'simple';
      const preset = PRESET_GRAPHS[presetKey] || PRESET_GRAPHS.simple;
      const graph = createGraph(preset.vertices, preset.edges);
      return {
        vertices: preset.vertices,
        edges: preset.edges,
        positions: preset.positions
      };
    }
    // Add more cases as needed
    default:
      return { array: parseArray(inputs.array || '5, 2, 8, 1, 9') };
  }
}

function generateRandomInputs(algorithmId) {
  const size = Math.floor(Math.random() * 6) + 5;
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);

  const sortingRandom = { array: arr.join(', ') };

  // For graph algorithms, randomly select a different preset
  if (['bfs', 'dfs'].includes(algorithmId)) {
    const presets = Object.keys(PRESET_GRAPHS);
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    const preset = PRESET_GRAPHS[randomPreset];
    const randomStart = preset.vertices[Math.floor(Math.random() * preset.vertices.length)];
    return { preset: randomPreset, startNode: randomStart };
  }

  if (algorithmId === 'dijkstra') {
    const presets = Object.keys(WEIGHTED_GRAPHS);
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    const preset = WEIGHTED_GRAPHS[randomPreset];
    const randomStart = preset.vertices[Math.floor(Math.random() * preset.vertices.length)];
    return { preset: randomPreset, startNode: randomStart };
  }

  if (algorithmId === 'topological-sort') {
    const presets = Object.keys(DAG_GRAPHS);
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    return { preset: randomPreset };
  }

  if (algorithmId === 'union-find') {
    const presets = Object.keys(PRESET_GRAPHS);
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    return { preset: randomPreset };
  }

  const randomByType = {
    'merge-sort': sortingRandom,
    'quick-sort': sortingRandom,
    'heap-sort': sortingRandom,
    'binary-search': {
      array: arr.sort((a, b) => a - b).join(', '),
      target: String(arr[Math.floor(arr.length / 2)]),
      templateKey: 'exact_search'
    },
    'sliding-window': {
      array: arr.join(', '),
      k: String(Math.floor(Math.random() * 3) + 2),
      mode: 'fixed_max_sum'
    },
  };

  return randomByType[algorithmId] || sortingRandom;
}

function renderInputFields(algorithmId, inputs, onChange) {
  // Sorting algorithms
  if (['merge-sort', 'quick-sort', 'heap-sort'].includes(algorithmId)) {
    return (
      <>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Array</label>
        <Input
          type="text"
          value={inputs.array}
          onChange={(e) => onChange('array', e.target.value)}
          placeholder="e.g., 5, 2, 8, 1, 9"
          className="text-sm"
        />
      </>
    );
  }

  // Binary Search
  if (algorithmId === 'binary-search') {
    return (
      <>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Sorted Array</label>
        <Input
          type="text"
          value={inputs.array}
          onChange={(e) => onChange('array', e.target.value)}
          placeholder="e.g., 1, 3, 5, 7, 9"
          className="text-sm"
        />
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Target</label>
        <Input
          type="text"
          value={inputs.target}
          onChange={(e) => onChange('target', e.target.value)}
          placeholder="e.g., 7"
          className="text-sm"
        />
      </>
    );
  }

  // Sliding Window
  if (algorithmId === 'sliding-window') {
    return (
      <>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Array</label>
        <Input
          type="text"
          value={inputs.array}
          onChange={(e) => onChange('array', e.target.value)}
          placeholder="e.g., 2, 1, 5, 1, 3, 2"
          className="text-sm"
        />
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Window Size (k)</label>
        <Input
          type="text"
          value={inputs.k}
          onChange={(e) => onChange('k', e.target.value)}
          placeholder="e.g., 3"
          className="text-sm"
        />
      </>
    );
  }

  // Graph algorithms - BFS and DFS
  if (['bfs', 'dfs'].includes(algorithmId)) {
    const presetKeys = Object.keys(PRESET_GRAPHS).filter(key =>
      !['weighted', 'dag'].includes(key)
    );
    const presetOptions = presetKeys.map(key => ({
      value: key,
      label: PRESET_GRAPHS[key].name
    }));

    return (
      <>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Graph Preset</label>
        <Select
          value={inputs.preset || 'simple'}
          onChange={(e) => onChange('preset', e.target.value)}
          options={presetOptions}
          className="text-sm"
        />
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Start Node</label>
        <Input
          type="text"
          value={inputs.startNode || 'A'}
          onChange={(e) => onChange('startNode', e.target.value)}
          placeholder="e.g., A"
          className="text-sm"
        />
      </>
    );
  }

  // Dijkstra
  if (algorithmId === 'dijkstra') {
    const weightedKeys = Object.keys(WEIGHTED_GRAPHS);
    const weightedOptions = weightedKeys.map(key => ({
      value: key,
      label: WEIGHTED_GRAPHS[key].name
    }));

    return (
      <>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Graph Preset</label>
        <Select
          value={inputs.preset || 'simple'}
          onChange={(e) => onChange('preset', e.target.value)}
          options={weightedOptions}
          className="text-sm"
        />
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Start Node</label>
        <Input
          type="text"
          value={inputs.startNode || 'A'}
          onChange={(e) => onChange('startNode', e.target.value)}
          placeholder="e.g., A"
          className="text-sm"
        />
      </>
    );
  }

  // Topological Sort
  if (algorithmId === 'topological-sort') {
    const dagKeys = Object.keys(DAG_GRAPHS);
    const dagOptions = dagKeys.map(key => ({
      value: key,
      label: DAG_GRAPHS[key].name
    }));

    return (
      <>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Graph Preset</label>
        <Select
          value={inputs.preset || 'simpleDAG'}
          onChange={(e) => onChange('preset', e.target.value)}
          options={dagOptions}
          className="text-sm"
        />
      </>
    );
  }

  // Union Find
  if (algorithmId === 'union-find') {
    const presetKeys = Object.keys(PRESET_GRAPHS);
    const presetOptions = presetKeys.map(key => ({
      value: key,
      label: PRESET_GRAPHS[key].name
    }));

    return (
      <>
        <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Graph Preset</label>
        <Select
          value={inputs.preset || 'simple'}
          onChange={(e) => onChange('preset', e.target.value)}
          options={presetOptions}
          className="text-sm"
        />
      </>
    );
  }

  // Default
  return (
    <>
      <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Input</label>
      <Input
        type="text"
        value={inputs.array || ''}
        onChange={(e) => onChange('array', e.target.value)}
        placeholder="Algorithm input"
        className="text-sm"
      />
    </>
  );
}
