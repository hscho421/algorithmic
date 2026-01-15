export { default as MinHeapVisualizer } from './MinHeapVisualizer';

export const metadata = {
  id: 'heaps',
  name: 'Heaps',
  description: 'Binary heap operations and properties',
  algorithms: [
    {
      id: 'min-heap',
      name: 'Binary Heap',
      description: 'Min/max heap operations, heapify, and key updates',
      component: 'MinHeapVisualizer',
    },
  ],
};
