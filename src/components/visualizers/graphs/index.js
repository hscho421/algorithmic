export { default as BFSVisualizer } from './BFSVisualizer';
export { default as DFSVisualizer } from './DFSVisualizer';
export { default as DijkstraVisualizer } from './DijkstraVisualizer';
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
    },
    {
      id: 'dfs',
      name: 'Depth-First Search',
      description: 'Deep exploration using a stack',
      component: 'DFSVisualizer',
    },
    {
      id: 'dijkstra',
      name: "Dijkstra's Algorithm",
      description: 'Shortest path in weighted graphs',
      component: 'DijkstraVisualizer',
    },
    {
      id: 'topological-sort',
      name: 'Topological Sort',
      description: 'Order vertices in a directed acyclic graph',
      component: 'TopologicalSortVisualizer',
    },
    {
      id: 'union-find',
      name: 'Union Find',
      description: 'Disjoint set union with path compression',
      component: 'UnionFindVisualizer',
    },
  ],
};
