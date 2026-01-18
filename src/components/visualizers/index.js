import { BinarySearchVisualizer, SlidingWindowVisualizer, TwoPointersVisualizer } from './searching';
import {
  MergeSortVisualizer,
  QuickSortVisualizer,
  HeapSortVisualizer,
  BubbleSortVisualizer,
  InsertionSortVisualizer,
  SelectionSortVisualizer,
  CountingSortVisualizer,
  RadixSortVisualizer,
} from './sorting';
import { BSTVisualizer, TraversalVisualizer } from './trees';
import { MinHeapVisualizer } from './heaps';
import { TrieVisualizer } from './strings';
import {
  BFSVisualizer,
  DFSVisualizer,
  DijkstraVisualizer,
  AStarVisualizer,
  MSTVisualizer,
  TopologicalSortVisualizer,
  UnionFindVisualizer,
} from './graphs';
import {
  FibonacciVisualizer,
  CoinChangeVisualizer,
  LCSVisualizer,
  KnapsackVisualizer,
} from './dynamic-programming';
import {
  LinkedListReversalVisualizer,
  CycleDetectionVisualizer,
} from './data-structures';
import { NQueensVisualizer, SudokuVisualizer } from './backtracking';

export const VISUALIZER_COMPONENTS = {
  'binary-search': BinarySearchVisualizer,
  'sliding-window': SlidingWindowVisualizer,
  'two-pointers': TwoPointersVisualizer,
  'bubble-sort': BubbleSortVisualizer,
  'insertion-sort': InsertionSortVisualizer,
  'selection-sort': SelectionSortVisualizer,
  'merge-sort': MergeSortVisualizer,
  'quick-sort': QuickSortVisualizer,
  'heap-sort': HeapSortVisualizer,
  'counting-sort': CountingSortVisualizer,
  'radix-sort': RadixSortVisualizer,
  bst: BSTVisualizer,
  'tree-traversals': TraversalVisualizer,
  'min-heap': MinHeapVisualizer,
  trie: TrieVisualizer,
  bfs: BFSVisualizer,
  dfs: DFSVisualizer,
  dijkstra: DijkstraVisualizer,
  'a-star': AStarVisualizer,
  'minimum-spanning-tree': MSTVisualizer,
  'topological-sort': TopologicalSortVisualizer,
  'union-find': UnionFindVisualizer,
  fibonacci: FibonacciVisualizer,
  'coin-change': CoinChangeVisualizer,
  lcs: LCSVisualizer,
  knapsack: KnapsackVisualizer,
  'linked-list-reversal': LinkedListReversalVisualizer,
  'cycle-detection': CycleDetectionVisualizer,
  'n-queens': NQueensVisualizer,
  sudoku: SudokuVisualizer,
};
