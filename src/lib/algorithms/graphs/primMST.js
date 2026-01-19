// Prim's Algorithm - Minimum Spanning Tree

export const template = {
  name: "Prim's Algorithm",
  description: 'Build MST by growing from a starting vertex',
  code: [
    { line: 'def prim(graph, start):', indent: 0 },
    { line: 'mst = []', indent: 1 },
    { line: 'visited = {start}', indent: 1 },
    { line: 'edges = [(w, start, v) for v, w in graph[start]]', indent: 1 },
    { line: 'heapify(edges)', indent: 1 },
    { line: '', indent: 0 },
    { line: 'while edges and len(visited) < V:', indent: 1 },
    { line: 'w, u, v = heappop(edges)', indent: 2 },
    { line: 'if v in visited: continue', indent: 2 },
    { line: '', indent: 0 },
    { line: 'visited.add(v)', indent: 2 },
    { line: 'mst.append((u, v, w))', indent: 2 },
    { line: '', indent: 0 },
    { line: 'for next_v, next_w in graph[v]:', indent: 2 },
    { line: 'if next_v not in visited:', indent: 3 },
    { line: 'heappush(edges, (next_w, v, next_v))', indent: 4 },
  ],
};

export const complexity = {
  time: 'O(E log V)',
  space: 'O(V + E)',
  bestCase: 'O(E log V)',
  averageCase: 'O(E log V)',
  worstCase: 'O(E log V)',
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
      mstEdges: [],
      visited: [],
      priorityQueue: [],
      current: null,
      highlightedNodes: {},
      highlightedEdges: [],
      done: true,
    });
    return steps;
  }

  const visited = new Set([startNode]);
  const mstEdges = [];
  const pq = [];

  // Add initial edges from start node (handle both {node, weight} and {to, weight} formats)
  if (adjacencyList[startNode]) {
    adjacencyList[startNode].forEach((neighbor) => {
      const to = neighbor.node || neighbor.to;
      pq.push({ weight: neighbor.weight, from: startNode, to });
    });
  }
  pq.sort((a, b) => a.weight - b.weight);

  addStep({
    phase: 'init',
    currentLine: 2,
    explanation: `Start from vertex ${startNode}. Add its edges to priority queue.`,
    mstEdges: [],
    visited: [startNode],
    priorityQueue: pq.map(e => ({ ...e })),
    totalWeight: 0,
    current: startNode,
    highlightedNodes: { [startNode]: 'visited' },
    highlightedEdges: [],
  });

  while (pq.length > 0 && visited.size < vertices.length) {
    const { weight, from, to } = pq.shift();

    addStep({
      phase: 'check-edge',
      currentLine: 7,
      explanation: `Extract min edge: ${from} → ${to} (weight: ${weight})`,
      mstEdges: mstEdges.map(e => ({ ...e })),
      visited: Array.from(visited),
      priorityQueue: pq.map(e => ({ ...e })),
      totalWeight: mstEdges.reduce((sum, e) => sum + e.weight, 0),
      current: from,
      highlightedNodes: {
        ...Object.fromEntries(Array.from(visited).map(v => [v, 'visited'])),
        [to]: 'checking',
      },
      highlightedEdges: [[from, to]],
    });

    if (visited.has(to)) {
      addStep({
        phase: 'skip-edge',
        currentLine: 8,
        explanation: `Vertex ${to} already visited. Skip this edge.`,
        mstEdges: mstEdges.map(e => ({ ...e })),
        visited: Array.from(visited),
        priorityQueue: pq.map(e => ({ ...e })),
        totalWeight: mstEdges.reduce((sum, e) => sum + e.weight, 0),
        current: null,
        highlightedNodes: Object.fromEntries(Array.from(visited).map(v => [v, 'visited'])),
        highlightedEdges: [],
      });
      continue;
    }

    // Add vertex to MST
    visited.add(to);
    mstEdges.push({ from, to, weight });

    addStep({
      phase: 'add-edge',
      currentLine: 11,
      explanation: `Add edge ${from} → ${to} to MST. Total weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}`,
      mstEdges: mstEdges.map(e => ({ ...e })),
      visited: Array.from(visited),
      priorityQueue: pq.map(e => ({ ...e })),
      totalWeight: mstEdges.reduce((sum, e) => sum + e.weight, 0),
      current: to,
      highlightedNodes: Object.fromEntries(Array.from(visited).map(v => [v, 'visited'])),
      highlightedEdges: mstEdges.map(e => [e.from, e.to]),
    });

    // Add new edges from the newly added vertex (handle both {node, weight} and {to, weight} formats)
    if (adjacencyList[to]) {
      const newEdges = [];
      adjacencyList[to].forEach((neighbor) => {
        const nextTo = neighbor.node || neighbor.to;
        const nextWeight = neighbor.weight;
        if (!visited.has(nextTo)) {
          pq.push({ weight: nextWeight, from: to, to: nextTo });
          newEdges.push({ from: to, to: nextTo, weight: nextWeight });
        }
      });
      pq.sort((a, b) => a.weight - b.weight);

      if (newEdges.length > 0) {
        addStep({
          phase: 'add-edges-to-pq',
          currentLine: 15,
          explanation: `Add edges from ${to} to unvisited neighbors`,
          mstEdges: mstEdges.map(e => ({ ...e })),
          visited: Array.from(visited),
          priorityQueue: pq.map(e => ({ ...e })),
          totalWeight: mstEdges.reduce((sum, e) => sum + e.weight, 0),
          current: to,
          highlightedNodes: Object.fromEntries(Array.from(visited).map(v => [v, 'visited'])),
          highlightedEdges: [
            ...mstEdges.map(e => [e.from, e.to]),
            ...newEdges.map(e => [e.from, e.to]),
          ],
        });
      }
    }
  }

  const totalWeight = mstEdges.reduce((sum, e) => sum + e.weight, 0);

  addStep({
    phase: 'done',
    currentLine: 11,
    explanation: `MST complete! Total weight: ${totalWeight}`,
    mstEdges: mstEdges.map(e => ({ ...e })),
    visited: Array.from(visited),
    priorityQueue: [],
    totalWeight,
    current: null,
    highlightedNodes: Object.fromEntries(Array.from(visited).map(v => [v, 'complete'])),
    highlightedEdges: mstEdges.map(e => [e.from, e.to]),
    done: true,
  });

  return steps;
};

export function initialState({ graph, startNode = 'A', positions } = {}) {
  const defaultGraph = {
    vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'C', to: 'D', weight: 8 },
      { from: 'C', to: 'E', weight: 10 },
      { from: 'D', to: 'E', weight: 2 },
      { from: 'D', to: 'F', weight: 6 },
      { from: 'E', to: 'F', weight: 3 },
    ],
    adjacencyList: {
      A: [{ to: 'B', weight: 4 }, { to: 'C', weight: 2 }],
      B: [{ to: 'A', weight: 4 }, { to: 'C', weight: 1 }, { to: 'D', weight: 5 }],
      C: [{ to: 'A', weight: 2 }, { to: 'B', weight: 1 }, { to: 'D', weight: 8 }, { to: 'E', weight: 10 }],
      D: [{ to: 'B', weight: 5 }, { to: 'C', weight: 8 }, { to: 'E', weight: 2 }, { to: 'F', weight: 6 }],
      E: [{ to: 'C', weight: 10 }, { to: 'D', weight: 2 }, { to: 'F', weight: 3 }],
      F: [{ to: 'D', weight: 6 }, { to: 'E', weight: 3 }],
    },
  };

  const defaultPositions = {
    A: { x: 15, y: 50 },
    B: { x: 40, y: 15 },
    C: { x: 40, y: 85 },
    D: { x: 65, y: 50 },
    E: { x: 65, y: 85 },
    F: { x: 90, y: 65 },
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

  const mstEdges = state.mstEdges || [];
  const totalWeight = state.totalWeight || 0;

  return {
    success: true,
    title: 'Minimum Spanning Tree Found',
    message: `MST contains ${mstEdges.length} edges with total weight ${totalWeight}`,
    details: mstEdges.map(e => `${e.from} — ${e.to}: ${e.weight}`),
  };
}
