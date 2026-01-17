export const template = {
  name: 'Topological Sort',
  description: "Kahn's algorithm — order vertices so all edges point forward",
  code: [
    { line: 'def topological_sort(graph):', indent: 0 },
    { line: 'in_degree = count_incoming_edges(graph)', indent: 1 },
    { line: 'queue = [v for v in graph if in_degree[v] == 0]', indent: 1 },
    { line: 'result = []', indent: 1 },
    { line: 'while queue:', indent: 1 },
    { line: 'node = queue.pop(0)', indent: 2 },
    { line: 'result.append(node)', indent: 2 },
    { line: 'for neighbor in graph[node]:', indent: 2 },
    { line: 'in_degree[neighbor] -= 1', indent: 3 },
    { line: 'if in_degree[neighbor] == 0:', indent: 3 },
    { line: 'queue.append(neighbor)', indent: 4 },
    { line: 'if len(result) != len(graph):', indent: 1 },
    { line: 'return "cycle detected"', indent: 2 },
    { line: 'return result', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(V + E)',
  space: 'O(V)',
  bestCase: 'O(V + E)',
  averageCase: 'O(V + E)',
  worstCase: 'O(V + E)',
};

const generateSteps = (graph, positions) => {
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

  // Calculate in-degrees
  const inDegree = {};
  vertices.forEach(v => {
    inDegree[v] = 0;
  });
  
  edges.forEach(([from, to]) => {
    inDegree[to] = (inDegree[to] || 0) + 1;
  });

  addStep({
    phase: 'init',
    currentLine: 1,
    explanation: `Calculating in-degrees for each vertex. In-degree = number of incoming edges.`,
    inDegree: { ...inDegree },
    queue: [],
    result: [],
    current: null,
    highlightedNodes: {},
    highlightedEdges: [],
  });

  // Find all nodes with in-degree 0
  const queue = vertices.filter(v => inDegree[v] === 0);

  addStep({
    phase: 'find-sources',
    currentLine: 2,
    explanation: `Found source nodes (in-degree = 0): [${queue.join(', ')}]. These have no dependencies.`,
    inDegree: { ...inDegree },
    queue: [...queue],
    result: [],
    current: null,
    highlightedNodes: Object.fromEntries(queue.map(v => [v, 'queued'])),
    highlightedEdges: [],
  });

  const result = [];

  addStep({
    phase: 'init-result',
    currentLine: 3,
    explanation: `Initialize empty result array to store topological order.`,
    inDegree: { ...inDegree },
    queue: [...queue],
    result: [],
    current: null,
    highlightedNodes: Object.fromEntries(queue.map(v => [v, 'queued'])),
    highlightedEdges: [],
  });

  while (queue.length > 0) {
    const current = queue.shift();

    addStep({
      phase: 'dequeue',
      currentLine: 5,
      explanation: `Dequeue "${current}" from queue.`,
      inDegree: { ...inDegree },
      queue: [...queue],
      result: [...result],
      current,
      highlightedNodes: {
        ...Object.fromEntries(result.map(v => [v, 'visited'])),
        ...Object.fromEntries(queue.map(v => [v, 'queued'])),
        [current]: 'current',
      },
      highlightedEdges: [],
    });

    result.push(current);

    addStep({
      phase: 'add-to-result',
      currentLine: 6,
      explanation: `Add "${current}" to result. Order so far: [${result.join(' → ')}]`,
      inDegree: { ...inDegree },
      queue: [...queue],
      result: [...result],
      current,
      highlightedNodes: {
        ...Object.fromEntries(result.map(v => [v, 'visited'])),
        ...Object.fromEntries(queue.map(v => [v, 'queued'])),
        [current]: 'current',
      },
      highlightedEdges: [],
    });

    const neighbors = adjacencyList[current] || [];

    for (const { node: neighbor } of neighbors) {
      addStep({
        phase: 'check-neighbor',
        currentLine: 7,
        explanation: `Checking outgoing edge ${current} → ${neighbor}.`,
        inDegree: { ...inDegree },
        queue: [...queue],
        result: [...result],
        current,
        highlightedNodes: {
          ...Object.fromEntries(result.map(v => [v, 'visited'])),
          ...Object.fromEntries(queue.map(v => [v, 'queued'])),
          [current]: 'current',
          [neighbor]: 'checking',
        },
        highlightedEdges: [[current, neighbor]],
      });

      inDegree[neighbor]--;

      addStep({
        phase: 'decrement',
        currentLine: 8,
        explanation: `Decrement in-degree of "${neighbor}": ${inDegree[neighbor] + 1} → ${inDegree[neighbor]}`,
        inDegree: { ...inDegree },
        queue: [...queue],
        result: [...result],
        current,
        highlightedNodes: {
          ...Object.fromEntries(result.map(v => [v, 'visited'])),
          ...Object.fromEntries(queue.map(v => [v, 'queued'])),
          [current]: 'current',
          [neighbor]: 'checking',
        },
        highlightedEdges: [[current, neighbor]],
      });

      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);

        addStep({
          phase: 'enqueue',
          currentLine: 10,
          explanation: `In-degree of "${neighbor}" is now 0. Add to queue — all its dependencies are satisfied.`,
          inDegree: { ...inDegree },
          queue: [...queue],
          result: [...result],
          current,
          highlightedNodes: {
            ...Object.fromEntries(result.map(v => [v, 'visited'])),
            ...Object.fromEntries(queue.map(v => [v, 'queued'])),
            [current]: 'current',
          },
          highlightedEdges: [[current, neighbor]],
        });
      }
    }
  }

  // Check for cycle
  const hasCycle = result.length !== vertices.length;

  if (hasCycle) {
    const unvisited = vertices.filter(v => !result.includes(v));
    addStep({
      phase: 'cycle-detected',
      currentLine: 12,
      explanation: `Cycle detected! Only ${result.length} of ${vertices.length} nodes processed. Nodes in cycle: [${unvisited.join(', ')}]`,
      inDegree: { ...inDegree },
      queue: [],
      result: [...result],
      current: null,
      highlightedNodes: {
        ...Object.fromEntries(result.map(v => [v, 'visited'])),
        ...Object.fromEntries(unvisited.map(v => [v, 'cycle'])),
      },
      highlightedEdges: [],
      hasCycle: true,
      done: true,
    });
  } else {
    addStep({
      phase: 'done',
      currentLine: 13,
      explanation: `Topological sort complete! Order: [${result.join(' → ')}]`,
      inDegree: { ...inDegree },
      queue: [],
      result: [...result],
      current: null,
      highlightedNodes: Object.fromEntries(result.map(v => [v, 'visited'])),
      highlightedEdges: [],
      hasCycle: false,
      done: true,
    });
  }

  return steps;
};

export const initialState = ({ graph, positions }) => {
  const steps = generateSteps(graph, positions);
  return {
    graph,
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

  if (state.hasCycle) {
    return {
      success: false,
      title: '✗ Cycle Detected',
      message: 'Graph contains a cycle — no valid topological order exists',
      details: `Processed ${state.result?.length || 0} of ${state.vertices?.length || 0} nodes`,
    };
  }

  return {
    success: true,
    title: '✓ Complete',
    message: `Topological order: [${state.result?.join(' → ') || ''}]`,
    details: `All ${state.result?.length || 0} nodes ordered`,
  };
};
