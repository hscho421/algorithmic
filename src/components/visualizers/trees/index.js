export { default as BSTVisualizer } from './BSTVisualizer';
export { default as TraversalVisualizer } from './TraversalVisualizer';
export { default as SegmentTreeVisualizer } from './SegmentTreeVisualizer';
export { default as LCAVisualizer } from './LCAVisualizer';

export const metadata = {
  id: 'trees',
  name: 'Tree Data Structures',
  description: 'Binary search trees and tree traversals',
  algorithms: [
    {
      id: 'bst',
      name: 'Binary Search Tree',
      description: 'Insert and search operations with O(log n) average complexity',
      component: 'BSTVisualizer',
      difficulty: 'Medium',
      tags: ['BST', 'Search Tree'],
    },
    {
      id: 'tree-traversals',
      name: 'Tree Traversals',
      description: 'In-order, pre-order, post-order, and level-order traversals',
      component: 'TraversalVisualizer',
      difficulty: 'Easy',
      tags: ['DFS', 'BFS', 'Recursion'],
    },
    {
      id: 'segment-tree',
      name: 'Segment Tree',
      description: 'Range queries and point updates',
      component: 'SegmentTreeVisualizer',
      difficulty: 'Hard',
      tags: ['Range Query', 'Tree'],
    },
    {
      id: 'lca',
      name: 'Lowest Common Ancestor',
      description: 'Find LCA using binary lifting',
      component: 'LCAVisualizer',
      difficulty: 'Hard',
      tags: ['Tree', 'Binary Lifting'],
    },
  ],
};
