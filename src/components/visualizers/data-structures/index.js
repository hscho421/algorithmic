export { default as LinkedListReversalVisualizer } from './LinkedListReversalVisualizer';
export { default as CycleDetectionVisualizer } from './CycleDetectionVisualizer';
export { default as LinkedListVisualization } from './LinkedListVisualization';
export { default as StackVisualizer } from './StackVisualizer';
export { default as QueueVisualizer } from './QueueVisualizer';
export { default as LRUCacheVisualizer } from './LRUCacheVisualizer';

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
    {
      id: 'stack',
      name: 'Stack',
      description: 'LIFO operations with push/pop/peek',
      component: 'StackVisualizer',
      difficulty: 'Easy',
      tags: ['LIFO', 'Operations'],
    },
    {
      id: 'queue',
      name: 'Queue',
      description: 'FIFO operations with enqueue/dequeue/front',
      component: 'QueueVisualizer',
      difficulty: 'Easy',
      tags: ['FIFO', 'Operations'],
    },
    {
      id: 'lru-cache',
      name: 'LRU Cache',
      description: 'Least-recently-used cache eviction',
      component: 'LRUCacheVisualizer',
      difficulty: 'Hard',
      tags: ['Cache', 'Hash Map', 'Linked List'],
    },
  ],
};
