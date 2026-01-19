export { default as BSTVisualizer } from './BSTVisualizer';
export { default as TraversalVisualizer } from './TraversalVisualizer';
export { default as SegmentTreeVisualizer } from './SegmentTreeVisualizer';
export { default as LCAVisualizer } from './LCAVisualizer';
export { default as AVLVisualizer } from './AVLVisualizer';
export { default as FenwickVisualizer } from './FenwickVisualizer';

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
    {
      id: 'avl-tree',
      name: 'AVL Tree',
      description: 'Self-balancing BST with rotations',
      component: 'AVLVisualizer',
      difficulty: 'Hard',
      tags: ['BST', 'Rotation', 'Balanced Tree'],
    },
    {
      id: 'fenwick-tree',
      name: 'Fenwick Tree',
      description: 'Binary Indexed Tree for prefix sums',
      component: 'FenwickVisualizer',
      difficulty: 'Medium',
      tags: ['Binary Indexed Tree', 'Prefix Sum'],
    },
  ],
};
