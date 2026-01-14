export const template = {
  name: 'Depth-First Search',
  description: 'Explore as deep as possible before backtracking',
  code: [
    { line: 'DFS(graph, start):', indent: 0 },
    { line: 'stack = [start]', indent: 1 },
    { line: 'visited = {}', indent: 1 },
    { line: 'while stack not empty:', indent: 1 },
    { line: 'node = stack.pop()', indent: 2 },
    { line: 'if node in visited: continue', indent: 2 },
    { line: 'visited.add(node)', indent: 2 },
    { line: 'process(node)', indent: 2 },
    { line: 'for neighbor in graph[node]:', indent: 2 },
    { line: 'if neighbor not in visited:', indent: 3 },
    { line: 'stack.push(neighbor)', indent: 4 },
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
      stack: [],
      current: null,
      highlightedNodes: {},
      highlightedEdges: [],
      done: true,
    });
    return steps;
  }

  const visited = new Set();
  const stack = [startNode];
  const visitOrder = [];

  addStep({
    phase: 'start',
    currentLine: 1,
    explanation: `Starting DFS from node "${startNode}". Initialize stack with start node.`,
    visited: [],
    stack: [...stack],
    current: null,
    highlightedNodes: { [startNode]: 'stacked' },
    highlightedEdges: [],
    visitOrder: [],
  });

  addStep({
    phase: 'init-visited',
    currentLine: 2,
    explanation: `Initialize empty visited set.`,
    visited: [],
    stack: [...stack],
    current: null,
    highlightedNodes: { [startNode]: 'stacked' },
    highlightedEdges: [],
    visitOrder: [],
  });

  while (stack.length > 0) {
    const current = stack.pop();

    addStep({
      phase: 'pop',
      currentLine: 4,
      explanation: `Pop "${current}" from top of stack.`,
      visited: [...visited],
      stack: [...stack],
      current,
      highlightedNodes: {
        ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
        ...Object.fromEntries(stack.map(v => [v, 'stacked'])),
        [current]: 'current',
      },
      highlightedEdges: [],
      visitOrder: [...visitOrder],
    });

    if (visited.has(current)) {
      addStep({
        phase: 'skip-visited',
        currentLine: 5,
        explanation: `"${current}" already visited. Skip and continue.`,
        visited: [...visited],
        stack: [...stack],
        current,
        highlightedNodes: {
          ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
          ...Object.fromEntries(stack.map(v => [v, 'stacked'])),
          [current]: 'visited',
        },
        highlightedEdges: [],
        visitOrder: [...visitOrder],
      });
      continue;
    }

    visited.add(current);
    visitOrder.push(current);

    addStep({
      phase: 'visit',
      currentLine: 6,
      explanation: `Mark "${current}" as visited.`,
      visited: [...visited],
      stack: [...stack],
      current,
      highlightedNodes: {
        ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
        ...Object.fromEntries(stack.map(v => [v, 'stacked'])),
        [current]: 'current',
      },
      highlightedEdges: [],
      visitOrder: [...visitOrder],
    });

    addStep({
      phase: 'process',
      currentLine: 7,
      explanation: `Process node "${current}". Visit order so far: [${visitOrder.join(', ')}]`,
      visited: [...visited],
      stack: [...stack],
      current,
      highlightedNodes: {
        ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
        ...Object.fromEntries(stack.map(v => [v, 'stacked'])),
        [current]: 'current',
      },
      highlightedEdges: [],
      visitOrder: [...visitOrder],
    });

    const neighbors = adjacencyList[current] || [];
    const reversedNeighbors = [...neighbors].reverse();

    for (const { node: neighbor } of reversedNeighbors) {
      addStep({
        phase: 'check-neighbor',
        currentLine: 8,
        explanation: `Checking neighbor "${neighbor}" of "${current}".`,
        visited: [...visited],
        stack: [...stack],
        current,
        highlightedNodes: {
          ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
          ...Object.fromEntries(stack.map(v => [v, 'stacked'])),
          [current]: 'current',
          [neighbor]: visited.has(neighbor) ? 'visited' : 'checking',
        },
        highlightedEdges: [[current, neighbor]],
        visitOrder: [...visitOrder],
      });

      if (!visited.has(neighbor)) {
        stack.push(neighbor);

        addStep({
          phase: 'push',
          currentLine: 10,
          explanation: `"${neighbor}" not visited. Push to stack.`,
          visited: [...visited],
          stack: [...stack],
          current,
          highlightedNodes: {
            ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
            ...Object.fromEntries(stack.map(v => [v, 'stacked'])),
            [current]: 'current',
          },
          highlightedEdges: [[current, neighbor]],
          visitOrder: [...visitOrder],
        });
      } else {
        addStep({
          phase: 'skip',
          currentLine: 9,
          explanation: `"${neighbor}" already visited. Skip.`,
          visited: [...visited],
          stack: [...stack],
          current,
          highlightedNodes: {
            ...Object.fromEntries([...visited].map(v => [v, 'visited'])),
            ...Object.fromEntries(stack.map(v => [v, 'stacked'])),
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
    explanation: `DFS complete! Visit order: [${visitOrder.join(', ')}]. Visited ${visitOrder.length} nodes.`,
    visited: [...visited],
    stack: [],
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
    message: `DFS traversal: [${state.visitOrder?.join(' → ') || ''}]`,
    details: `Visited ${state.visitOrder?.length || 0} nodes`,
  };
};
