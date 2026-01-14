export { default as BinarySearchVisualizer } from './BinarySearchVisualizer';

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
  ],
};
