export const template = {
  name: "Dijkstra's Algorithm",
  description: 'Find shortest paths from source to all vertices',
  code: [
    { line: 'def dijkstra(graph, start):', indent: 0 },
    { line: 'dist[start] = 0', indent: 1 },
    { line: 'for v in graph: dist.setdefault(v, float("inf"))', indent: 1 },
    { line: 'pq = [(0, start)]', indent: 1 },
    { line: 'while pq:', indent: 1 },
    { line: 'd, u = pq.pop(0)', indent: 2 },
    { line: 'if d > dist[u]: continue', indent: 2 },
    { line: 'for v in graph[u]:', indent: 2 },
    { line: 'alt = dist[u] + weight(u, v)', indent: 3 },
    { line: 'if alt < dist[v]:', indent: 3 },
    { line: 'dist[v] = alt', indent: 4 },
    { line: 'prev[v] = u', indent: 4 },
    { line: 'pq.append((alt, v))', indent: 4 },
  ],
};

export const complexity = {
  time: 'O((V + E) log V)',
  space: 'O(V)',
  bestCase: 'O((V + E) log V)',
  averageCase: 'O((V + E) log V)',
  worstCase: 'O((V + E) log V)',
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
      visited: [],
      current: null,
      highlightedNodes: {},
      highlightedEdges: [],
      priorityQueue: [],
      done: true,
    });
    return steps;
  }

  const distances = {};
  const previous = {};
  const visited = new Set();
  const pq = [];

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
    visited: [],
    current: null,
    highlightedNodes: { [startNode]: 'current' },
    highlightedEdges: [],
    priorityQueue: [],
  });

  pq.push({ dist: 0, node: startNode });

  addStep({
    phase: 'init-pq',
    currentLine: 3,
    explanation: `Add start node to priority queue: (distance: 0, node: ${startNode})`,
    distances: { ...distances },
    previous: { ...previous },
    visited: [],
    current: null,
    highlightedNodes: { [startNode]: 'queued' },
    highlightedEdges: [],
    priorityQueue: pq.map(p => ({ ...p })),
  });

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { dist: currentDist, node: current } = pq.shift();

    addStep({
      phase: 'extract',
      currentLine: 5,
      explanation: `Extract minimum: node "${current}" with distance ${currentDist}`,
      distances: { ...distances },
      previous: { ...previous },
      visited: [...visited],
      current,
      highlightedNodes: {
        ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
        [current]: 'current',
        ...Object.fromEntries(pq.map(p => [p.node, 'queued'])),
      },
      highlightedEdges: [],
      priorityQueue: pq.map(p => ({ ...p })),
    });

    if (currentDist > distances[current]) {
      addStep({
        phase: 'skip-outdated',
        currentLine: 6,
        explanation: `Skip: found distance ${currentDist} > known distance ${distances[current]}`,
        distances: { ...distances },
        previous: { ...previous },
        visited: [...visited],
        current,
        highlightedNodes: {
          ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
          [current]: 'visited',
          ...Object.fromEntries(pq.map(p => [p.node, 'queued'])),
        },
        highlightedEdges: [],
        priorityQueue: pq.map(p => ({ ...p })),
      });
      continue;
    }

    visited.add(current);

    addStep({
      phase: 'mark-visited',
      currentLine: 7,
      explanation: `Mark "${current}" as visited. Examining neighbors...`,
      distances: { ...distances },
      previous: { ...previous },
      visited: [...visited],
      current,
      highlightedNodes: {
        ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
        [current]: 'current',
        ...Object.fromEntries(pq.map(p => [p.node, 'queued'])),
      },
      highlightedEdges: [],
      priorityQueue: pq.map(p => ({ ...p })),
    });

    const neighbors = adjacencyList[current] || [];

    for (const { node: neighbor, weight } of neighbors) {
      const alt = distances[current] + weight;

      addStep({
        phase: 'check-neighbor',
        currentLine: 8,
        explanation: `Checking edge ${current} → ${neighbor} (weight: ${weight}). New distance would be ${distances[current]} + ${weight} = ${alt}`,
        distances: { ...distances },
        previous: { ...previous },
        visited: [...visited],
        current,
        highlightedNodes: {
          ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
          [current]: 'current',
          [neighbor]: visited.has(neighbor) ? 'visited' : 'checking',
          ...Object.fromEntries(pq.filter(p => p.node !== neighbor).map(p => [p.node, 'queued'])),
        },
        highlightedEdges: [[current, neighbor]],
        priorityQueue: pq.map(p => ({ ...p })),
        comparing: { from: current, to: neighbor, weight, alt, currentDist: distances[neighbor] },
      });

      if (alt < distances[neighbor]) {
        distances[neighbor] = alt;
        previous[neighbor] = current;

        addStep({
          phase: 'update-distance',
          currentLine: 10,
          explanation: `Found shorter path! Update dist[${neighbor}] = ${alt} (was ${distances[neighbor] === Infinity ? '∞' : distances[neighbor]})`,
          distances: { ...distances },
          previous: { ...previous },
          visited: [...visited],
          current,
          highlightedNodes: {
            ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
            [current]: 'current',
            [neighbor]: 'updated',
            ...Object.fromEntries(pq.filter(p => p.node !== neighbor).map(p => [p.node, 'queued'])),
          },
          highlightedEdges: [[current, neighbor]],
          priorityQueue: pq.map(p => ({ ...p })),
        });

        pq.push({ dist: alt, node: neighbor });

        addStep({
          phase: 'add-to-pq',
          currentLine: 12,
          explanation: `Add (${alt}, ${neighbor}) to priority queue`,
          distances: { ...distances },
          previous: { ...previous },
          visited: [...visited],
          current,
          highlightedNodes: {
            ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
            [current]: 'current',
            [neighbor]: 'queued',
            ...Object.fromEntries(pq.filter(p => p.node !== neighbor).map(p => [p.node, 'queued'])),
          },
          highlightedEdges: [[current, neighbor]],
          priorityQueue: pq.map(p => ({ ...p })),
        });
      } else {
        addStep({
          phase: 'no-update',
          currentLine: 9,
          explanation: `No improvement: ${alt} ≥ current dist[${neighbor}] = ${distances[neighbor]}`,
          distances: { ...distances },
          previous: { ...previous },
          visited: [...visited],
          current,
          highlightedNodes: {
            ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
            [current]: 'current',
            [neighbor]: visited.has(neighbor) ? 'visited' : 'queued',
            ...Object.fromEntries(pq.filter(p => p.node !== neighbor).map(p => [p.node, 'queued'])),
          },
          highlightedEdges: [[current, neighbor]],
          priorityQueue: pq.map(p => ({ ...p })),
        });
      }
    }
  }

  // Build shortest path tree edges
  const pathEdges = [];
  vertices.forEach(v => {
    if (previous[v]) {
      pathEdges.push([previous[v], v]);
    }
  });

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `Dijkstra complete! Found shortest paths from "${startNode}" to all reachable nodes.`,
    distances: { ...distances },
    previous: { ...previous },
    visited: [...visited],
    current: null,
    highlightedNodes: Object.fromEntries([...visited].map(v => [v, 'visited'])),
    highlightedEdges: pathEdges,
    priorityQueue: [],
    pathEdges,
    done: true,
  });

  return steps;
};

export const initialState = ({ graph, startNode, positions }) => {
  const steps = generateSteps(graph, startNode, positions);
  return {
    graph,
    startNode,
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
  return state.explanation || 'Initializing...';
};

export const getResult = (state) => {
  if (!state.done) return null;

  const reachable = Object.entries(state.distances || {})
    .filter(([_, d]) => d !== Infinity)
    .length;

  return {
    success: true,
    title: '✓ Complete',
    message: `Found shortest paths to ${reachable} nodes`,
    details: `From source "${state.startNode}"`,
  };
};
