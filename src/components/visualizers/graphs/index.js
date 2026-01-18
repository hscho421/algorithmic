export { default as BFSVisualizer } from './BFSVisualizer';
export { default as DFSVisualizer } from './DFSVisualizer';
export { default as DijkstraVisualizer } from './DijkstraVisualizer';
export { default as AStarVisualizer } from './AStarVisualizer';
export { default as MSTVisualizer } from './MSTVisualizer';
export { default as TopologicalSortVisualizer } from './TopologicalSortVisualizer';
export { default as UnionFindVisualizer } from './UnionFindVisualizer';

export const metadata = {
  id: 'graphs',
  name: 'Graph Algorithms',
  description: 'Traversal and pathfinding algorithms on graphs',
  algorithms: [
    {
      id: 'bfs',
      name: 'Breadth-First Search',
      description: 'Level-by-level traversal using a queue',
      component: 'BFSVisualizer',
      difficulty: 'Easy',
      tags: ['Traversal', 'Queue'],
    },
    {
      id: 'dfs',
      name: 'Depth-First Search',
      description: 'Deep exploration using a stack',
      component: 'DFSVisualizer',
      difficulty: 'Easy',
      tags: ['Traversal', 'Stack', 'Recursion'],
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      description: 'Shortest path in weighted graphs',
      component: 'DijkstraVisualizer',
      difficulty: 'Medium',
      tags: ['Shortest Path', 'Weighted Graph'],
    },
    {
      id: 'a-star',
      name: 'A* Pathfinding',
      description: 'Shortest path using heuristic search',
      component: 'AStarVisualizer',
      difficulty: 'Medium',
      tags: ['Shortest Path', 'Heuristic'],
    },
    {
      id: 'minimum-spanning-tree',
      name: "Kruskal's MST",
      description: 'Build a minimum spanning tree',
      component: 'MSTVisualizer',
      difficulty: 'Medium',
      tags: ['MST', 'Union Find', 'Greedy'],
    },
    {
      id: 'topological-sort',
      name: 'Topological Sort',
      description: 'Order vertices in a directed acyclic graph',
      component: 'TopologicalSortVisualizer',
      difficulty: 'Hard',
      tags: ['DAG', 'Linear Ordering'],
    },
    {
      id: 'union-find',
      name: 'Union Find',
      description: 'Disjoint set union with path compression',
      component: 'UnionFindVisualizer',
      difficulty: 'Medium',
      tags: ['Disjoint Set', 'Connectivity'],
    },
  ],
};
