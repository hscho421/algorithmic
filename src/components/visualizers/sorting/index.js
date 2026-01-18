export { default as MergeSortVisualizer } from './MergeSortVisualizer';
export { default as QuickSortVisualizer } from './QuickSortVisualizer';
export { default as HeapSortVisualizer } from './HeapSortVisualizer';
export { default as BubbleSortVisualizer } from './BubbleSortVisualizer';
export { default as InsertionSortVisualizer } from './InsertionSortVisualizer';
export { default as SelectionSortVisualizer } from './SelectionSortVisualizer';
export { default as CountingSortVisualizer } from './CountingSortVisualizer';
export { default as RadixSortVisualizer } from './RadixSortVisualizer';
export { default as SortingArrayVisualization } from './SortingArrayVisualization';

export const metadata = {
  id: 'sorting',
  name: 'Sorting Algorithms',
  description: 'Comparison and divide-and-conquer sorting algorithms',
  algorithms: [
    {
      id: 'bubble-sort',
      name: 'Bubble Sort',
      description: 'Compare adjacent elements and swap if out of order',
      component: 'BubbleSortVisualizer',
      difficulty: 'Easy',
      tags: ['Comparison', 'In-place'],
    },
    {
      id: 'insertion-sort',
      name: 'Insertion Sort',
      description: 'Build sorted array one element at a time',
      component: 'InsertionSortVisualizer',
      difficulty: 'Easy',
      tags: ['Comparison', 'In-place', 'Stable'],
    },
    {
      id: 'selection-sort',
      name: 'Selection Sort',
      description: 'Find minimum and place at beginning',
      component: 'SelectionSortVisualizer',
      difficulty: 'Easy',
      tags: ['Comparison', 'In-place'],
    },
    {
      id: 'merge-sort',
      name: 'Merge Sort',
      description: 'Divide and conquer sorting with O(n log n) complexity',
      component: 'MergeSortVisualizer',
      difficulty: 'Medium',
      tags: ['Divide & Conquer', 'Stable Sort'],
    },
    {
      id: 'quick-sort',
      name: 'Quick Sort',
      description: 'In-place partitioning with O(n log n) average complexity',
      component: 'QuickSortVisualizer',
      difficulty: 'Medium',
      tags: ['Divide & Conquer', 'In-place'],
    },
    {
      id: 'heap-sort',
      name: 'Heap Sort',
      description: 'Max-heap based sorting with O(n log n) complexity',
      component: 'HeapSortVisualizer',
      difficulty: 'Medium',
      tags: ['Heap', 'In-place'],
    },
    {
      id: 'counting-sort',
      name: 'Counting Sort',
      description: 'Non-comparison sort using element frequency',
      component: 'CountingSortVisualizer',
      difficulty: 'Medium',
      tags: ['Non-comparison', 'Linear Time'],
    },
    {
      id: 'radix-sort',
      name: 'Radix Sort',
      description: 'Sort by processing individual digits',
      component: 'RadixSortVisualizer',
      difficulty: 'Medium',
      tags: ['Non-comparison', 'Linear Time'],
    },
  ],
};
