import { BinarySearchVisualizer, SlidingWindowVisualizer } from './searching';
import { MergeSortVisualizer, QuickSortVisualizer, HeapSortVisualizer } from './sorting';
import { BSTVisualizer, TraversalVisualizer } from './trees';
import { MinHeapVisualizer } from './heaps';
import { TrieVisualizer } from './strings';
import {
  BFSVisualizer,
  DFSVisualizer,
  DijkstraVisualizer,
  TopologicalSortVisualizer,
  UnionFindVisualizer,
} from './graphs';
import {
  FibonacciVisualizer,
  CoinChangeVisualizer,
  LCSVisualizer,
  KnapsackVisualizer,
} from './dynamic-programming';

export const VISUALIZER_COMPONENTS = {
  'binary-search': BinarySearchVisualizer,
  'sliding-window': SlidingWindowVisualizer,
  'merge-sort': MergeSortVisualizer,
  'quick-sort': QuickSortVisualizer,
  'heap-sort': HeapSortVisualizer,
  bst: BSTVisualizer,
  'tree-traversals': TraversalVisualizer,
  'min-heap': MinHeapVisualizer,
  trie: TrieVisualizer,
  bfs: BFSVisualizer,
  dfs: DFSVisualizer,
  dijkstra: DijkstraVisualizer,
  'topological-sort': TopologicalSortVisualizer,
  'union-find': UnionFindVisualizer,
  fibonacci: FibonacciVisualizer,
  'coin-change': CoinChangeVisualizer,
  lcs: LCSVisualizer,
  knapsack: KnapsackVisualizer,
};
