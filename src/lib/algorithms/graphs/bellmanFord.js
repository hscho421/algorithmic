// Bellman-Ford Algorithm - Single Source Shortest Path with Negative Weights

export const template = {
  name: 'Bellman-Ford Algorithm',
  description: 'Find shortest paths even with negative edge weights',
  code: [
    { line: 'def bellman_ford(graph, start):', indent: 0 },
    { line: 'dist[start] = 0', indent: 1 },
    { line: 'for v in graph: dist.setdefault(v, float("inf"))', indent: 1 },
    { line: '', indent: 0 },
    { line: 'for i in range(V - 1):', indent: 1 },
    { line: 'for u, v, w in edges:', indent: 2 },
    { line: 'if dist[u] + w < dist[v]:', indent: 3 },
    { line: 'dist[v] = dist[u] + w', indent: 4 },
    { line: 'prev[v] = u', indent: 4 },
    { line: '', indent: 0 },
    { line: '# Check for negative cycles', indent: 1 },
    { line: 'for u, v, w in edges:', indent: 1 },
    { line: 'if dist[u] + w < dist[v]:', indent: 2 },
    { line: 'return "Negative cycle detected"', indent: 3 },
  ],
};

export const complexity = {
  time: 'O(V × E)',
  space: 'O(V)',
  bestCase: 'O(V × E)',
  averageCase: 'O(V × E)',
  worstCase: 'O(V × E)',
};

const generateSteps = (graph, startNode, positions) => {
  const steps = [];
  const { adjacencyList, vertices, edges } = graph;

  const addStep = (state) => {
    steps.push({
      vertices,
      edges,
      positions,
      ...state,
    });
  };

  if (!vertices.includes(startNode)) {
    addStep({
      phase: 'error',
      currentLine: 0,
      explanation: `Start node "${startNode}" not found in graph`,
      distances: {},
      previous: {},
      iteration: 0,
      current: null,
      highlightedNodes: {},
      highlightedEdges: [],
      done: true,
    });
    return steps;
  }

  const distances = {};
  const previous = {};

  // Initialize distances
  vertices.forEach(v => {
    distances[v] = v === startNode ? 0 : Infinity;
    previous[v] = null;
  });

  addStep({
    phase: 'init',
    currentLine: 1,
    explanation: `Initialize distances. Set dist[${startNode}] = 0, all others = ∞`,
    distances: { ...distances },
    previous: { ...previous },
    iteration: 0,
    current: null,
    highlightedNodes: { [startNode]: 'current' },
    highlightedEdges: [],
  });

  // Handle both array [from, to, weight] and object {from, to, weight} edge formats
  const edgeList = [];
  edges.forEach(edge => {
    if (Array.isArray(edge)) {
      edgeList.push({ from: edge[0], to: edge[1], weight: edge[2] || 1 });
    } else {
      edgeList.push({ from: edge.from, to: edge.to, weight: edge.weight });
    }
  });

  // V-1 iterations
  const V = vertices.length;
  for (let i = 0; i < V - 1; i++) {
    let updated = false;

    addStep({
      phase: 'iteration-start',
      currentLine: 4,
      explanation: `Starting iteration ${i + 1} of ${V - 1}`,
      distances: { ...distances },
      previous: { ...previous },
      iteration: i + 1,
      current: null,
      highlightedNodes: {},
      highlightedEdges: [],
    });

    for (const edge of edgeList) {
      const { from: u, to: v, weight: w } = edge;

      addStep({
        phase: 'checking-edge',
        currentLine: 5,
        explanation: `Checking edge ${u} → ${v} (weight: ${w})`,
        distances: { ...distances },
        previous: { ...previous },
        iteration: i + 1,
        current: u,
        highlightedNodes: { [u]: 'current', [v]: 'neighbor' },
        highlightedEdges: [[u, v]],
      });

      if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
        const oldDist = distances[v];
        distances[v] = distances[u] + w;
        previous[v] = u;
        updated = true;

        addStep({
          phase: 'relaxed',
          currentLine: 7,
          explanation: `Relaxed: dist[${v}] = ${oldDist === Infinity ? '∞' : oldDist} → ${distances[v]}`,
          distances: { ...distances },
          previous: { ...previous },
          iteration: i + 1,
          current: u,
          highlightedNodes: { [u]: 'current', [v]: 'updated' },
          highlightedEdges: [[u, v]],
        });
      }
    }

    if (!updated) {
      addStep({
        phase: 'early-termination',
        currentLine: 4,
        explanation: `No updates in iteration ${i + 1}. Algorithm can terminate early.`,
        distances: { ...distances },
        previous: { ...previous },
        iteration: i + 1,
        current: null,
        highlightedNodes: {},
        highlightedEdges: [],
      });
      break;
    }
  }

  // Check for negative cycles
  addStep({
    phase: 'checking-negative-cycle',
    currentLine: 11,
    explanation: 'Checking for negative-weight cycles...',
    distances: { ...distances },
    previous: { ...previous },
    iteration: V,
    current: null,
    highlightedNodes: {},
    highlightedEdges: [],
  });

  let hasNegativeCycle = false;
  for (const edge of edgeList) {
    const { from: u, to: v, weight: w } = edge;
    if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
      hasNegativeCycle = true;
      addStep({
        phase: 'negative-cycle-found',
        currentLine: 13,
        explanation: `Negative cycle detected! Edge ${u} → ${v} can still be relaxed.`,
        distances: { ...distances },
        previous: { ...previous },
        iteration: V,
        current: null,
        highlightedNodes: { [u]: 'error', [v]: 'error' },
        highlightedEdges: [[u, v]],
        hasNegativeCycle: true,
        done: true,
      });
      break;
    }
  }

  if (!hasNegativeCycle) {
    addStep({
      phase: 'done',
      currentLine: 13,
      explanation: 'No negative cycles. Shortest paths found!',
      distances: { ...distances },
      previous: { ...previous },
      iteration: V,
      current: null,
      highlightedNodes: Object.fromEntries(vertices.map(v => [v, 'complete'])),
      highlightedEdges: [],
      done: true,
    });
  }

  return steps;
};

export function initialState({ graph, startNode = 'A', positions } = {}) {
  const defaultGraph = {
    vertices: ['A', 'B', 'C', 'D', 'E'],
    edges: [
      { from: 'A', to: 'B', weight: -1 },
      { from: 'A', to: 'C', weight: 4 },
      { from: 'B', to: 'C', weight: 3 },
      { from: 'B', to: 'D', weight: 2 },
      { from: 'B', to: 'E', weight: 2 },
      { from: 'D', to: 'B', weight: 1 },
      { from: 'D', to: 'C', weight: 5 },
      { from: 'E', to: 'D', weight: -3 },
    ],
    adjacencyList: {
      A: [{ to: 'B', weight: -1 }, { to: 'C', weight: 4 }],
      B: [{ to: 'C', weight: 3 }, { to: 'D', weight: 2 }, { to: 'E', weight: 2 }],
      C: [],
      D: [{ to: 'B', weight: 1 }, { to: 'C', weight: 5 }],
      E: [{ to: 'D', weight: -3 }],
    },
  };

  const defaultPositions = {
    A: { x: 15, y: 50 },
    B: { x: 40, y: 20 },
    C: { x: 85, y: 50 },
    D: { x: 40, y: 80 },
    E: { x: 85, y: 20 },
  };

  const g = graph || defaultGraph;
  const pos = positions || defaultPositions;

  const steps = generateSteps(g, startNode, pos);

  return {
    ...steps[0],
    steps,
    stepIndex: 0,
    startNode,
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
      message: 'The graph contains a negative-weight cycle. Shortest paths are undefined.',
      details: [],
    };
  }

  const distances = state.distances || {};
  const details = Object.entries(distances)
    .filter(([v]) => v !== state.startNode)
    .map(([v, d]) => `Distance to ${v}: ${d === Infinity ? '∞' : d}`);

  return {
    success: true,
    title: 'Shortest Paths Found',
    message: `Found shortest paths from ${state.startNode} to all vertices`,
    details,
  };
}
