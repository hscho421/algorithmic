export { default as BinarySearchVisualizer } from './BinarySearchVisualizer';
export { default as SlidingWindowVisualizer } from './SlidingWindowVisualizer';
export { default as TwoPointersVisualizer } from './TwoPointersVisualizer';
export { default as KadaneVisualizer } from './KadaneVisualizer';

export const metadata = {
  id: 'searching',
  name: 'Searching Algorithms',
  description: 'Binary search and its variants',
  algorithms: [
    {
      id: 'binary-search',
      name: 'Binary Search',
      description: 'Search in sorted arrays with O(log n) complexity',
      component: 'BinarySearchVisualizer',
      difficulty: 'Easy',
      tags: ['Sorted Array', 'Divide & Conquer'],
    },
    {
      id: 'sliding-window',
      name: 'Sliding Window',
      description: 'Fixed and variable window patterns for arrays and strings',
      component: 'SlidingWindowVisualizer',
      difficulty: 'Medium',
      tags: ['Array', 'String', 'Subarray'],
    },
    {
      id: 'two-pointers',
      name: 'Two Pointers',
      description: 'Find pairs with target sum using two pointers',
      component: 'TwoPointersVisualizer',
      difficulty: 'Easy',
      tags: ['Sorted Array', 'Two Pointers'],
    },
    {
      id: 'kadane',
      name: "Kadane's Algorithm",
      description: 'Find maximum subarray sum in O(n) time',
      component: 'KadaneVisualizer',
      difficulty: 'Medium',
      tags: ['Array', 'Dynamic Programming', 'Greedy'],
    },
  ],
};
