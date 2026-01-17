export const template = {
  name: 'Breadth-First Search',
  description: 'Level-by-level graph traversal using a queue',
  code: [
    { line: 'def bfs(graph, start):', indent: 0 },
    { line: 'queue = [start]', indent: 1 },
    { line: 'visited = {start}', indent: 1 },
    { line: 'while queue:', indent: 1 },
    { line: 'node = queue.pop(0)', indent: 2 },
    { line: 'process(node)', indent: 2 },
    { line: 'for neighbor in graph[node]:', indent: 2 },
    { line: 'if neighbor not in visited:', indent: 3 },
    { line: 'visited.add(neighbor)', indent: 4 },
    { line: 'queue.append(neighbor)', indent: 4 },
  ],
};

export const complexity = {
  time: 'O(V + E)',
  space: 'O(V)',
  bestCase: 'O(V + E)',
  averageCase: 'O(V + E)',
  worstCase: 'O(V + E)',
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
      visited: [],
      queue: [],
      current: null,
      highlightedNodes: {},
      highlightedEdges: [],
      done: true,
    });
    return steps;
  }

  const visited = new Set([startNode]);
  const queue = [startNode];
  const visitOrder = [];
  const parent = {};

  addStep({
    phase: 'start',
    currentLine: 1,
    explanation: `Starting BFS from node "${startNode}". Initialize queue with start node.`,
    visited: [startNode],
    queue: [...queue],
    current: null,
    highlightedNodes: { [startNode]: 'queued' },
    highlightedEdges: [],
    visitOrder: [],
  });

  addStep({
    phase: 'init-visited',
    currentLine: 2,
    explanation: `Mark "${startNode}" as visited to avoid revisiting.`,
    visited: [startNode],
    queue: [...queue],
    current: null,
    highlightedNodes: { [startNode]: 'queued' },
    highlightedEdges: [],
    visitOrder: [],
  });

  while (queue.length > 0) {
    const current = queue.shift();
    visitOrder.push(current);

    addStep({
      phase: 'dequeue',
      currentLine: 4,
      explanation: `Dequeue "${current}" from front of queue.`,
      visited: [...visited],
      queue: [...queue],
      current,
      highlightedNodes: {
        ...Object.fromEntries([...visited].map(v => [v, visitOrder.includes(v) ? 'visited' : 'queued'])),
        [current]: 'current',
      },
      highlightedEdges: [],
      visitOrder: [...visitOrder],
    });

    addStep({
      phase: 'process',
      currentLine: 5,
      explanation: `Process node "${current}". Visit order so far: [${visitOrder.join(', ')}]`,
      visited: [...visited],
      queue: [...queue],
      current,
      highlightedNodes: {
        ...Object.fromEntries([...visited].map(v => [v, visitOrder.includes(v) ? 'visited' : 'queued'])),
        [current]: 'current',
      },
      highlightedEdges: [],
      visitOrder: [...visitOrder],
    });

    const neighbors = adjacencyList[current] || [];

    for (const { node: neighbor } of neighbors) {
      addStep({
        phase: 'check-neighbor',
        currentLine: 6,
        explanation: `Checking neighbor "${neighbor}" of "${current}".`,
        visited: [...visited],
        queue: [...queue],
        current,
        highlightedNodes: {
          ...Object.fromEntries([...visited].map(v => [v, visitOrder.includes(v) ? 'visited' : 'queued'])),
          [current]: 'current',
          [neighbor]: visited.has(neighbor) ? (visitOrder.includes(neighbor) ? 'visited' : 'queued') : 'checking',
        },
        highlightedEdges: [[current, neighbor]],
        visitOrder: [...visitOrder],
      });

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        parent[neighbor] = current;

        addStep({
          phase: 'enqueue',
          currentLine: 9,
          explanation: `"${neighbor}" not visited. Mark visited and add to queue.`,
          visited: [...visited],
          queue: [...queue],
          current,
          highlightedNodes: {
            ...Object.fromEntries([...visited].map(v => [v, visitOrder.includes(v) ? 'visited' : 'queued'])),
            [current]: 'current',
            [neighbor]: 'queued',
          },
          highlightedEdges: [[current, neighbor]],
          visitOrder: [...visitOrder],
        });
      } else {
        addStep({
          phase: 'skip',
          currentLine: 7,
          explanation: `"${neighbor}" already visited. Skip.`,
          visited: [...visited],
          queue: [...queue],
          current,
          highlightedNodes: {
            ...Object.fromEntries([...visited].map(v => [v, visitOrder.includes(v) ? 'visited' : 'queued'])),
            [current]: 'current',
          },
          highlightedEdges: [[current, neighbor]],
          visitOrder: [...visitOrder],
        });
      }
    }
  }

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `BFS complete! Visit order: [${visitOrder.join(', ')}]. Visited ${visitOrder.length} nodes.`,
    visited: [...visited],
    queue: [],
    current: null,
    highlightedNodes: Object.fromEntries([...visited].map(v => [v, 'visited'])),
    highlightedEdges: [],
    visitOrder: [...visitOrder],
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

  return {
    success: true,
    title: '✓ Complete',
    message: `BFS traversal: [${state.visitOrder?.join(' → ') || ''}]`,
    details: `Visited ${state.visitOrder?.length || 0} nodes`,
  };
};
