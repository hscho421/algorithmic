export const template = {
  name: "Kruskal's Algorithm (MST)",
  description: 'Build a minimum spanning tree by sorting edges',
  code: [
    { line: 'def kruskal(vertices, edges):', indent: 0 },
    { line: 'parent = {v: v for v in vertices}', indent: 1 },
    { line: 'sort edges by weight', indent: 1 },
    { line: 'mst = []', indent: 1 },
    { line: 'for (u, v, w) in edges:', indent: 1 },
    { line: 'if find(u) != find(v):', indent: 2 },
    { line: 'mst.append((u, v, w))', indent: 3 },
    { line: 'union(u, v)', indent: 3 },
    { line: 'return mst', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(E log E)',
  space: 'O(V)',
  bestCase: 'O(E log E)',
  averageCase: 'O(E log E)',
  worstCase: 'O(E log E)',
};

const generateSteps = (graph, positions) => {
  const steps = [];
  const { vertices = [], edges = [] } = graph || {};

  const addStep = (state) => {
    steps.push({
      vertices,
      edges,
      positions,
      ...state,
    });
  };

  if (!graph || vertices.length === 0) {
    addStep({
      phase: 'error',
      currentLine: 0,
      explanation: 'No vertices available to build an MST.',
      highlightedNodes: {},
      highlightedEdges: [],
      pathEdges: [],
      mstEdges: [],
      totalWeight: 0,
      done: true,
    });
    return steps;
  }

  const parent = {};
  const rank = {};
  vertices.forEach((v) => {
    parent[v] = v;
    rank[v] = 0;
  });

  const find = (v) => {
    if (parent[v] !== v) {
      parent[v] = find(parent[v]);
    }
    return parent[v];
  };

  const union = (a, b) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) return false;
    if (rank[rootA] < rank[rootB]) {
      parent[rootA] = rootB;
    } else if (rank[rootA] > rank[rootB]) {
      parent[rootB] = rootA;
    } else {
      parent[rootB] = rootA;
      rank[rootA] += 1;
    }
    return true;
  };

  const sortedEdges = [...edges].sort((a, b) => (a[2] ?? 1) - (b[2] ?? 1));
  const mstEdges = [];
  let totalWeight = 0;

  addStep({
    phase: 'init',
    currentLine: 1,
    explanation: 'Initialize disjoint sets for each vertex.',
    highlightedNodes: {},
    highlightedEdges: [],
    pathEdges: [],
    mstEdges: [],
    totalWeight,
    sortedEdges: [...sortedEdges],
  });

  addStep({
    phase: 'sort-edges',
    currentLine: 2,
    explanation: 'Sort edges by ascending weight.',
    highlightedNodes: {},
    highlightedEdges: [],
    pathEdges: [],
    mstEdges: [],
    totalWeight,
    sortedEdges: [...sortedEdges],
  });

  for (const [from, to, weight = 1] of sortedEdges) {
    const rootFrom = find(from);
    const rootTo = find(to);

    addStep({
      phase: 'check-edge',
      currentLine: 4,
      explanation: `Check edge ${from} — ${to} (w=${weight}).`,
      highlightedNodes: { [from]: 'checking', [to]: 'checking' },
      highlightedEdges: [[from, to]],
      pathEdges: [...mstEdges],
      mstEdges: [...mstEdges],
      totalWeight,
      sortedEdges: [...sortedEdges],
    });

    if (rootFrom !== rootTo) {
      union(from, to);
      mstEdges.push([from, to, weight]);
      totalWeight += weight;

      addStep({
        phase: 'add-edge',
        currentLine: 6,
        explanation: `No cycle detected. Add edge ${from} — ${to} to MST.`,
        highlightedNodes: { [from]: 'updated', [to]: 'updated' },
        highlightedEdges: [[from, to]],
        pathEdges: [...mstEdges],
        mstEdges: [...mstEdges],
        totalWeight,
        sortedEdges: [...sortedEdges],
      });

      if (mstEdges.length === vertices.length - 1) {
        break;
      }
    } else {
      addStep({
        phase: 'skip-edge',
        currentLine: 5,
        explanation: `Skipping edge ${from} — ${to}; it would create a cycle.`,
        highlightedNodes: { [from]: 'cycle', [to]: 'cycle' },
        highlightedEdges: [[from, to]],
        pathEdges: [...mstEdges],
        mstEdges: [...mstEdges],
        totalWeight,
        sortedEdges: [...sortedEdges],
      });
    }
  }

  const success = mstEdges.length === vertices.length - 1;

  addStep({
    phase: 'done',
    currentLine: 8,
    explanation: success
      ? `MST complete with ${mstEdges.length} edges and total weight ${totalWeight}.`
      : 'Graph is disconnected. Built a minimum spanning forest.',
    highlightedNodes: Object.fromEntries(vertices.map((v) => [v, 'visited'])),
    highlightedEdges: [],
    pathEdges: [...mstEdges],
    mstEdges: [...mstEdges],
    totalWeight,
    sortedEdges: [...sortedEdges],
    done: true,
    success,
  });

  return steps;
};

export const initialState = ({ graph, positions }) => {
  const steps = generateSteps(graph, positions);
  return {
    graph,
    positions,
    steps,
    stepIndex: 0,
    done: false,
    ...steps[0],
  };
};

export const executeStep = (state) => {
  const { steps, stepIndex } = state;
  const nextIndex = stepIndex + 1;

  if (nextIndex >= steps.length) {
    return { ...state, done: true };
  }

  return {
    ...state,
    stepIndex: nextIndex,
    ...steps[nextIndex],
  };
};

export const getExplanation = (state) => {
  return state.explanation || 'Initializing MST...';
};

export const getResult = (state) => {
  if (!state.done) return null;
  if (state.success) {
    return {
      success: true,
      title: 'Minimum Spanning Tree',
      message: `Total weight: ${state.totalWeight}`,
      details: [
        `Edges selected: ${state.mstEdges?.length || 0}`,
        `Vertices covered: ${state.vertices?.length || 0}`,
      ],
    };
  }

  return {
    success: false,
    title: 'Disconnected Graph',
    message: 'No single MST exists. Built a spanning forest instead.',
    details: [
      `Edges selected: ${state.mstEdges?.length || 0}`,
      `Vertices: ${state.vertices?.length || 0}`,
    ],
  };
};
