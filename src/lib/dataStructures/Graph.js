export const createGraph = (vertices, edges, directed = false) => {
  const adjacencyList = {};
  
  vertices.forEach(v => {
    adjacencyList[v] = [];
  });
  
  edges.forEach(([from, to, weight = 1]) => {
    adjacencyList[from].push({ node: to, weight });
    if (!directed) {
      adjacencyList[to].push({ node: from, weight });
    }
  });
  
  return { vertices, edges, adjacencyList, directed };
};

export const PRESET_GRAPHS = {
  simple: {
    name: 'Simple Graph',
    vertices: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      ['A', 'B'],
      ['A', 'C'],
      ['B', 'D'],
      ['C', 'D'],
      ['D', 'E'],
    ],
    positions: {
      A: { x: 20, y: 50 },
      B: { x: 40, y: 20 },
      C: { x: 40, y: 80 },
      D: { x: 60, y: 50 },
      E: { x: 80, y: 50 },
    },
  },
  tree: {
    name: 'Tree Structure',
    vertices: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    edges: [
      ['A', 'B'],
      ['A', 'C'],
      ['B', 'D'],
      ['B', 'E'],
      ['C', 'F'],
      ['C', 'G'],
    ],
    positions: {
      A: { x: 50, y: 15 },
      B: { x: 30, y: 45 },
      C: { x: 70, y: 45 },
      D: { x: 20, y: 75 },
      E: { x: 40, y: 75 },
      F: { x: 60, y: 75 },
      G: { x: 80, y: 75 },
    },
  },
  cycle: {
    name: 'Graph with Cycle',
    vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      ['A', 'B'],
      ['B', 'C'],
      ['C', 'D'],
      ['D', 'E'],
      ['E', 'F'],
      ['F', 'A'],
      ['A', 'D'],
    ],
    positions: {
      A: { x: 50, y: 10 },
      B: { x: 80, y: 30 },
      C: { x: 80, y: 70 },
      D: { x: 50, y: 90 },
      E: { x: 20, y: 70 },
      F: { x: 20, y: 30 },
    },
  },
  disconnected: {
    name: 'Disconnected Graph',
    vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      ['A', 'B'],
      ['B', 'C'],
      ['D', 'E'],
      ['E', 'F'],
    ],
    positions: {
      A: { x: 20, y: 30 },
      B: { x: 40, y: 30 },
      C: { x: 60, y: 30 },
      D: { x: 20, y: 70 },
      E: { x: 40, y: 70 },
      F: { x: 60, y: 70 },
    },
  },
  dense: {
    name: 'Dense Graph',
    vertices: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      ['A', 'B'],
      ['A', 'C'],
      ['A', 'D'],
      ['A', 'E'],
      ['B', 'C'],
      ['B', 'D'],
      ['C', 'D'],
      ['C', 'E'],
      ['D', 'E'],
    ],
    positions: {
      A: { x: 50, y: 15 },
      B: { x: 85, y: 40 },
      C: { x: 70, y: 85 },
      D: { x: 30, y: 85 },
      E: { x: 15, y: 40 },
    },
  },
};

export const WEIGHTED_GRAPHS = {
  simple: {
    name: 'Simple Weighted',
    vertices: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      ['A', 'B', 4],
      ['A', 'C', 2],
      ['B', 'C', 1],
      ['B', 'D', 5],
      ['C', 'D', 8],
      ['C', 'E', 10],
      ['D', 'E', 2],
    ],
    positions: {
      A: { x: 15, y: 50 },
      B: { x: 40, y: 20 },
      C: { x: 40, y: 80 },
      D: { x: 70, y: 35 },
      E: { x: 85, y: 65 },
    },
  },
  grid: {
    name: 'Grid Graph',
    vertices: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    edges: [
      ['A', 'B', 1],
      ['B', 'C', 2],
      ['A', 'D', 4],
      ['B', 'E', 3],
      ['C', 'F', 1],
      ['D', 'E', 2],
      ['E', 'F', 5],
      ['D', 'G', 3],
      ['E', 'H', 1],
      ['F', 'I', 2],
      ['G', 'H', 4],
      ['H', 'I', 3],
    ],
    positions: {
      A: { x: 20, y: 20 },
      B: { x: 50, y: 20 },
      C: { x: 80, y: 20 },
      D: { x: 20, y: 50 },
      E: { x: 50, y: 50 },
      F: { x: 80, y: 50 },
      G: { x: 20, y: 80 },
      H: { x: 50, y: 80 },
      I: { x: 80, y: 80 },
    },
  },
  complex: {
    name: 'Complex Network',
    vertices: ['S', 'A', 'B', 'C', 'D', 'E', 'T'],
    edges: [
      ['S', 'A', 7],
      ['S', 'B', 2],
      ['S', 'C', 3],
      ['A', 'B', 3],
      ['A', 'D', 4],
      ['B', 'C', 4],
      ['B', 'D', 4],
      ['B', 'E', 1],
      ['C', 'E', 5],
      ['D', 'T', 1],
      ['E', 'T', 3],
    ],
    positions: {
      S: { x: 10, y: 50 },
      A: { x: 30, y: 20 },
      B: { x: 35, y: 50 },
      C: { x: 30, y: 80 },
      D: { x: 65, y: 30 },
      E: { x: 65, y: 70 },
      T: { x: 90, y: 50 },
    },
  },
  shortestPath: {
    name: 'Shortest Path Demo',
    vertices: ['1', '2', '3', '4', '5', '6'],
    edges: [
      ['1', '2', 7],
      ['1', '3', 9],
      ['1', '6', 14],
      ['2', '3', 10],
      ['2', '4', 15],
      ['3', '4', 11],
      ['3', '6', 2],
      ['4', '5', 6],
      ['5', '6', 9],
    ],
    positions: {
      '1': { x: 15, y: 50 },
      '2': { x: 35, y: 20 },
      '3': { x: 35, y: 80 },
      '4': { x: 65, y: 20 },
      '5': { x: 85, y: 50 },
      '6': { x: 65, y: 80 },
    },
  },
};

export const DAG_GRAPHS = {
  courseDependencies: {
    name: 'Course Dependencies',
    vertices: ['CS101', 'CS102', 'CS201', 'CS202', 'CS301', 'CS302'],
    edges: [
      ['CS101', 'CS102'],
      ['CS101', 'CS201'],
      ['CS102', 'CS202'],
      ['CS201', 'CS202'],
      ['CS201', 'CS301'],
      ['CS202', 'CS302'],
      ['CS301', 'CS302'],
    ],
    positions: {
      'CS101': { x: 15, y: 50 },
      'CS102': { x: 35, y: 25 },
      'CS201': { x: 35, y: 75 },
      'CS202': { x: 55, y: 50 },
      'CS301': { x: 75, y: 75 },
      'CS302': { x: 85, y: 50 },
    },
  },
  buildSystem: {
    name: 'Build System',
    vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      ['A', 'B'],
      ['A', 'C'],
      ['B', 'D'],
      ['C', 'D'],
      ['C', 'E'],
      ['D', 'F'],
      ['E', 'F'],
    ],
    positions: {
      'A': { x: 15, y: 50 },
      'B': { x: 35, y: 25 },
      'C': { x: 35, y: 75 },
      'D': { x: 55, y: 35 },
      'E': { x: 55, y: 75 },
      'F': { x: 85, y: 50 },
    },
  },
  taskScheduling: {
    name: 'Task Scheduling',
    vertices: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    edges: [
      ['T1', 'T2'],
      ['T1', 'T3'],
      ['T2', 'T4'],
      ['T3', 'T4'],
      ['T3', 'T5'],
      ['T4', 'T6'],
      ['T5', 'T6'],
      ['T6', 'T7'],
    ],
    positions: {
      'T1': { x: 10, y: 50 },
      'T2': { x: 30, y: 25 },
      'T3': { x: 30, y: 75 },
      'T4': { x: 50, y: 35 },
      'T5': { x: 50, y: 75 },
      'T6': { x: 70, y: 50 },
      'T7': { x: 90, y: 50 },
    },
  },
  simpleDAG: {
    name: 'Simple DAG',
    vertices: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      ['A', 'B'],
      ['A', 'C'],
      ['B', 'D'],
      ['C', 'D'],
      ['D', 'E'],
    ],
    positions: {
      'A': { x: 15, y: 50 },
      'B': { x: 40, y: 25 },
      'C': { x: 40, y: 75 },
      'D': { x: 65, y: 50 },
      'E': { x: 90, y: 50 },
    },
  },
  diamondDAG: {
    name: 'Diamond DAG',
    vertices: ['S', 'A', 'B', 'C', 'D', 'T'],
    edges: [
      ['S', 'A'],
      ['S', 'B'],
      ['A', 'C'],
      ['A', 'D'],
      ['B', 'C'],
      ['B', 'D'],
      ['C', 'T'],
      ['D', 'T'],
    ],
    positions: {
      'S': { x: 10, y: 50 },
      'A': { x: 30, y: 25 },
      'B': { x: 30, y: 75 },
      'C': { x: 60, y: 25 },
      'D': { x: 60, y: 75 },
      'T': { x: 90, y: 50 },
    },
  },
};
