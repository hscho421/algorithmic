export { default as BinarySearchVisualizer } from './BinarySearchVisualizer';
export { default as SlidingWindowVisualizer } from './SlidingWindowVisualizer';

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
    },
    {
      id: 'sliding-window',
      name: 'Sliding Window',
      description: 'Fixed and variable window patterns for arrays and strings',
      component: 'SlidingWindowVisualizer',
    },
  ],
};
