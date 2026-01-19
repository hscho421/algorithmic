// Floyd-Warshall Algorithm - All Pairs Shortest Path

export const template = {
  name: 'Floyd-Warshall Algorithm',
  description: 'Find shortest paths between all pairs of vertices',
  code: [
    { line: 'def floyd_warshall(graph):', indent: 0 },
    { line: 'dist = [[inf] * V for _ in range(V)]', indent: 1 },
    { line: 'for v in range(V): dist[v][v] = 0', indent: 1 },
    { line: 'for u, v, w in edges: dist[u][v] = w', indent: 1 },
    { line: '', indent: 0 },
    { line: 'for k in range(V):', indent: 1 },
    { line: 'for i in range(V):', indent: 2 },
    { line: 'for j in range(V):', indent: 3 },
    { line: 'if dist[i][k] + dist[k][j] < dist[i][j]:', indent: 4 },
    { line: 'dist[i][j] = dist[i][k] + dist[k][j]', indent: 5 },
    { line: '', indent: 0 },
    { line: 'return dist', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(V³)',
  space: 'O(V²)',
  bestCase: 'O(V³)',
  averageCase: 'O(V³)',
  worstCase: 'O(V³)',
};

const generateSteps = (graph, positions) => {
  const steps = [];
  const { vertices, edges } = graph;
  const V = vertices.length;
  const vertexIndex = {};
  vertices.forEach((v, i) => { vertexIndex[v] = i; });

  const addStep = (state) => {
    steps.push({
      vertices,
      edges,
      positions,
      V,
      ...state,
    });
  };

  // Initialize distance matrix
  const dist = Array(V).fill(null).map(() => Array(V).fill(Infinity));
  const next = Array(V).fill(null).map(() => Array(V).fill(null));

  // Self-loops have distance 0
  for (let i = 0; i < V; i++) {
    dist[i][i] = 0;
  }

  // Initialize with direct edges
  edges.forEach((edge) => {
    const [from, to, weight] = Array.isArray(edge)
      ? edge
      : [edge.from, edge.to, edge.weight];
    const i = vertexIndex[from];
    const j = vertexIndex[to];
    if (i === undefined || j === undefined) return;
    dist[i][j] = weight;
    next[i][j] = j;
  });

  addStep({
    phase: 'init',
    currentLine: 3,
    explanation: 'Initialize distance matrix with direct edge weights',
    dist: dist.map(row => [...row]),
    k: null,
    i: null,
    j: null,
    highlightedNodes: {},
    highlightedEdges: [],
    highlightCell: null,
  });

  // Floyd-Warshall main algorithm
  for (let k = 0; k < V; k++) {
    addStep({
      phase: 'k-iteration',
      currentLine: 5,
      explanation: `Consider paths through vertex ${vertices[k]} (k=${k})`,
      dist: dist.map(row => [...row]),
      k,
      i: null,
      j: null,
      highlightedNodes: { [vertices[k]]: 'intermediate' },
      highlightedEdges: [],
      highlightCell: null,
    });

    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (i === j || i === k || j === k) continue;

        const throughK = dist[i][k] + dist[k][j];

        addStep({
          phase: 'checking',
          currentLine: 8,
          explanation: `Check: dist[${vertices[i]}][${vertices[j]}] = ${dist[i][j] === Infinity ? '∞' : dist[i][j]} vs ${dist[i][k] === Infinity ? '∞' : dist[i][k]} + ${dist[k][j] === Infinity ? '∞' : dist[k][j]} = ${throughK === Infinity ? '∞' : throughK}`,
          dist: dist.map(row => [...row]),
          k,
          i,
          j,
          highlightedNodes: {
            [vertices[i]]: 'source',
            [vertices[k]]: 'intermediate',
            [vertices[j]]: 'destination',
          },
          highlightedEdges: [
            [vertices[i], vertices[k]],
            [vertices[k], vertices[j]],
          ],
          highlightCell: { row: i, col: j },
          comparing: { ik: dist[i][k], kj: dist[k][j], ij: dist[i][j] },
        });

        if (throughK < dist[i][j]) {
          dist[i][j] = throughK;
          next[i][j] = next[i][k];

          addStep({
            phase: 'updated',
            currentLine: 9,
            explanation: `Update: dist[${vertices[i]}][${vertices[j]}] = ${throughK} (via ${vertices[k]})`,
            dist: dist.map(row => [...row]),
            k,
            i,
            j,
            highlightedNodes: {
              [vertices[i]]: 'source',
              [vertices[k]]: 'intermediate',
              [vertices[j]]: 'destination',
            },
            highlightedEdges: [
              [vertices[i], vertices[k]],
              [vertices[k], vertices[j]],
            ],
            highlightCell: { row: i, col: j, updated: true },
          });
        }
      }
    }
  }

  // Check for negative cycles
  let hasNegativeCycle = false;
  for (let i = 0; i < V; i++) {
    if (dist[i][i] < 0) {
      hasNegativeCycle = true;
      break;
    }
  }

  addStep({
    phase: 'done',
    currentLine: 11,
    explanation: hasNegativeCycle
      ? 'Negative cycle detected (diagonal has negative value)'
      : 'All pairs shortest paths computed successfully!',
    dist: dist.map(row => [...row]),
    k: null,
    i: null,
    j: null,
    highlightedNodes: {},
    highlightedEdges: [],
    highlightCell: null,
    hasNegativeCycle,
    done: true,
  });

  return steps;
};

export function initialState({ graph, positions } = {}) {
  const defaultGraph = {
    vertices: ['A', 'B', 'C', 'D'],
    edges: [
      { from: 'A', to: 'B', weight: 3 },
      { from: 'A', to: 'D', weight: 7 },
      { from: 'B', to: 'A', weight: 8 },
      { from: 'B', to: 'C', weight: 2 },
      { from: 'C', to: 'A', weight: 5 },
      { from: 'C', to: 'D', weight: 1 },
      { from: 'D', to: 'A', weight: 2 },
    ],
    adjacencyList: {
      A: [{ to: 'B', weight: 3 }, { to: 'D', weight: 7 }],
      B: [{ to: 'A', weight: 8 }, { to: 'C', weight: 2 }],
      C: [{ to: 'A', weight: 5 }, { to: 'D', weight: 1 }],
      D: [{ to: 'A', weight: 2 }],
    },
  };

  const defaultPositions = {
    A: { x: 20, y: 20 },
    B: { x: 80, y: 20 },
    C: { x: 80, y: 80 },
    D: { x: 20, y: 80 },
  };

  const g = graph || defaultGraph;
  const pos = positions || defaultPositions;

  const steps = generateSteps(g, pos);

  return {
    ...steps[0],
    steps,
    stepIndex: 0,
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const nextIndex = state.stepIndex + 1;
  if (nextIndex >= state.steps.length) {
    return { ...state, done: true };
  }

  return {
    ...state,
    ...state.steps[nextIndex],
    stepIndex: nextIndex,
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  if (state.hasNegativeCycle) {
    return {
      success: false,
      title: 'Negative Cycle Detected',
      message: 'The graph contains a negative-weight cycle',
      details: [],
    };
  }

  const { dist, vertices } = state;
  const details = [];
  for (let i = 0; i < vertices.length; i++) {
    for (let j = 0; j < vertices.length; j++) {
      if (i !== j && dist[i][j] !== Infinity) {
        details.push(`${vertices[i]} → ${vertices[j]}: ${dist[i][j]}`);
      }
    }
  }

  return {
    success: true,
    title: 'All Pairs Shortest Paths',
    message: `Computed shortest paths between all ${vertices.length} vertices`,
    details: details.slice(0, 10),
  };
}
