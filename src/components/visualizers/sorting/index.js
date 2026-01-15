export { default as MergeSortVisualizer } from './MergeSortVisualizer';
export { default as QuickSortVisualizer } from './QuickSortVisualizer';
export { default as HeapSortVisualizer } from './HeapSortVisualizer';
export { default as SortingArrayVisualization } from './SortingArrayVisualization';

export const metadata = {
  id: 'sorting',
  name: 'Sorting Algorithms',
  description: 'Comparison and divide-and-conquer sorting algorithms',
  algorithms: [
    {
      id: 'merge-sort',
      name: 'Merge Sort',
      description: 'Divide and conquer sorting with O(n log n) complexity',
      component: 'MergeSortVisualizer',
    },
    {
      id: 'quick-sort',
      name: 'Quick Sort',
      description: 'In-place partitioning with O(n log n) average complexity',
      component: 'QuickSortVisualizer',
    },
    {
      id: 'heap-sort',
      name: 'Heap Sort',
      description: 'Max-heap based sorting with O(n log n) complexity',
      component: 'HeapSortVisualizer',
    },
  ],
};
