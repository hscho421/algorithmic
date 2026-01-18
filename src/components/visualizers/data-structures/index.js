export { default as LinkedListReversalVisualizer } from './LinkedListReversalVisualizer';
export { default as CycleDetectionVisualizer } from './CycleDetectionVisualizer';
export { default as LinkedListVisualization } from './LinkedListVisualization';

export const metadata = {
  id: 'data-structures',
  name: 'Data Structures',
  description: 'Fundamental data structure operations and algorithms',
  algorithms: [
    {
      id: 'linked-list-reversal',
      name: 'Linked List Reversal',
      description: 'Reverse a singly linked list in-place',
      component: 'LinkedListReversalVisualizer',
      difficulty: 'Easy',
      tags: ['Linked List', 'In-place'],
    },
    {
      id: 'cycle-detection',
      name: 'Cycle Detection',
      description: "Floyd's Tortoise and Hare algorithm",
      component: 'CycleDetectionVisualizer',
      difficulty: 'Medium',
      tags: ['Linked List', 'Two Pointers'],
    },
  ],
};
