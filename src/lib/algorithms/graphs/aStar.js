export const template = {
  name: 'A* Pathfinding',
  description: 'Shortest path using cost + heuristic (f = g + h)',
  code: [
    { line: 'def a_star(graph, start, goal):', indent: 0 },
    { line: 'open_set = {start}', indent: 1 },
    { line: 'g[start] = 0', indent: 1 },
    { line: 'f[start] = h(start, goal)', indent: 1 },
    { line: 'while open_set:', indent: 1 },
    { line: 'current = argmin f in open_set', indent: 2 },
    { line: 'if current == goal: return path', indent: 2 },
    { line: 'open_set.remove(current)', indent: 2 },
    { line: 'for neighbor in graph[current]:', indent: 2 },
    { line: 'tentative = g[current] + weight', indent: 3 },
    { line: 'if tentative < g[neighbor]:', indent: 3 },
    { line: 'came_from[neighbor] = current', indent: 4 },
    { line: 'g[neighbor] = tentative', indent: 4 },
    { line: 'f[neighbor] = g + h', indent: 4 },
    { line: 'open_set.add(neighbor)', indent: 4 },
  ],
};

export const complexity = {
  time: 'O(E log V)',
  space: 'O(V)',
  bestCase: 'O(E log V)',
  averageCase: 'O(E log V)',
  worstCase: 'O(E log V)',
};

const distance = (a, b) => {
  if (!a || !b) return 0;
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const reconstructPath = (cameFrom, current) => {
  const path = [current];
  while (cameFrom[current]) {
    current = cameFrom[current];
    path.unshift(current);
  }
  return path;
};

const generateSteps = (graph, startNode, goalNode, positions) => {
  const steps = [];
  const { adjacencyList, vertices, edges } = graph || {};

  const addStep = (state) => {
    steps.push({
      vertices,
      edges,
      positions,
      ...state,
    });
  };

  if (!graph || !vertices?.length) {
    addStep({
      phase: 'error',
      currentLine: 0,
      explanation: 'No graph available for A* pathfinding.',
      openSet: [],
      closedSet: [],
      current: null,
      highlightedNodes: {},
      highlightedEdges: [],
      distances: {},
      pathEdges: [],
      done: true,
      success: false,
    });
    return steps;
  }

  if (!vertices.includes(startNode) || !vertices.includes(goalNode)) {
    addStep({
      phase: 'error',
      currentLine: 0,
      explanation: 'Start or goal node not found in graph.',
      openSet: [],
      closedSet: [],
      current: null,
      highlightedNodes: {},
      highlightedEdges: [],
      distances: {},
      pathEdges: [],
      done: true,
      success: false,
    });
    return steps;
  }

  const gScore = {};
  const fScore = {};
  const cameFrom = {};
  const openSet = new Set([startNode]);
  const closedSet = new Set();

  vertices.forEach((v) => {
    gScore[v] = v === startNode ? 0 : Infinity;
    fScore[v] = v === startNode ? distance(positions[v], positions[goalNode]) : Infinity;
    cameFrom[v] = null;
  });

  addStep({
    phase: 'init',
    currentLine: 1,
    explanation: `Initialize open set with start node ${startNode}.`,
    openSet: [...openSet],
    closedSet: [],
    current: null,
    highlightedNodes: { [startNode]: 'queued', [goalNode]: 'current' },
    highlightedEdges: [],
    distances: { ...gScore },
    pathEdges: [],
    cameFrom: { ...cameFrom },
  });

  while (openSet.size > 0) {
    let current = null;
    let lowestF = Infinity;
    openSet.forEach((node) => {
      if (fScore[node] < lowestF) {
        lowestF = fScore[node];
        current = node;
      }
    });

    addStep({
      phase: 'pick-current',
      currentLine: 5,
      explanation: `Pick node "${current}" with lowest f-score (${lowestF.toFixed(1)}).`,
      openSet: [...openSet],
      closedSet: [...closedSet],
      current,
      highlightedNodes: {
        ...Object.fromEntries([...closedSet].map((v) => [v, 'visited'])),
        ...Object.fromEntries([...openSet].filter((v) => v !== current).map((v) => [v, 'queued'])),
        [current]: 'current',
        [goalNode]: 'updated',
      },
      highlightedEdges: [],
      distances: { ...gScore },
      pathEdges: [],
      cameFrom: { ...cameFrom },
    });

    if (current === goalNode) {
      const path = reconstructPath(cameFrom, current);
      const pathEdges = path.slice(1).map((node, idx) => [path[idx], node]);

      addStep({
        phase: 'found',
        currentLine: 6,
        explanation: `Goal reached! Path length: ${gScore[goalNode]}.`,
        openSet: [...openSet],
        closedSet: [...closedSet],
        current,
        highlightedNodes: {
          ...Object.fromEntries(path.map((v) => [v, 'visited'])),
          [current]: 'current',
        },
        highlightedEdges: [],
        distances: { ...gScore },
        pathEdges,
        cameFrom: { ...cameFrom },
        done: true,
        success: true,
        path,
      });
      return steps;
    }

    openSet.delete(current);
    closedSet.add(current);

    addStep({
      phase: 'close-current',
      currentLine: 7,
      explanation: `Move "${current}" to closed set.`,
      openSet: [...openSet],
      closedSet: [...closedSet],
      current,
      highlightedNodes: {
        ...Object.fromEntries([...closedSet].map((v) => [v, 'visited'])),
        ...Object.fromEntries([...openSet].map((v) => [v, 'queued'])),
        [current]: 'current',
      },
      highlightedEdges: [],
      distances: { ...gScore },
      pathEdges: [],
      cameFrom: { ...cameFrom },
    });

    const neighbors = adjacencyList[current] || [];
    for (const { node: neighbor, weight } of neighbors) {
      const tentative = gScore[current] + weight;

      addStep({
        phase: 'check-neighbor',
        currentLine: 9,
        explanation: `Check ${current} → ${neighbor} (w=${weight}). Tentative g = ${tentative}.`,
        openSet: [...openSet],
        closedSet: [...closedSet],
        current,
        highlightedNodes: {
          ...Object.fromEntries([...closedSet].map((v) => [v, 'visited'])),
          ...Object.fromEntries([...openSet].map((v) => [v, 'queued'])),
          [current]: 'current',
          [neighbor]: closedSet.has(neighbor) ? 'visited' : 'checking',
        },
        highlightedEdges: [[current, neighbor]],
        distances: { ...gScore },
        pathEdges: [],
        cameFrom: { ...cameFrom },
      });

      if (closedSet.has(neighbor) && tentative >= gScore[neighbor]) {
        addStep({
          phase: 'skip-neighbor',
          currentLine: 9,
          explanation: `Skip ${neighbor}; already closed with a better or equal path.`,
          openSet: [...openSet],
          closedSet: [...closedSet],
          current,
          highlightedNodes: {
            ...Object.fromEntries([...closedSet].map((v) => [v, 'visited'])),
            ...Object.fromEntries([...openSet].map((v) => [v, 'queued'])),
            [current]: 'current',
            [neighbor]: 'visited',
          },
          highlightedEdges: [[current, neighbor]],
          distances: { ...gScore },
          pathEdges: [],
          cameFrom: { ...cameFrom },
        });
        continue;
      }

      if (tentative < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentative;
        fScore[neighbor] = tentative + distance(positions[neighbor], positions[goalNode]);
        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        }

        addStep({
          phase: 'update',
          currentLine: 11,
          explanation: `Update ${neighbor}: g=${tentative}, f=${fScore[neighbor].toFixed(1)}.`,
          openSet: [...openSet],
          closedSet: [...closedSet],
          current,
          highlightedNodes: {
            ...Object.fromEntries([...closedSet].map((v) => [v, 'visited'])),
            ...Object.fromEntries([...openSet].filter((v) => v !== neighbor).map((v) => [v, 'queued'])),
            [current]: 'current',
            [neighbor]: 'updated',
          },
          highlightedEdges: [[current, neighbor]],
          distances: { ...gScore },
          pathEdges: [],
          cameFrom: { ...cameFrom },
        });
      }
    }
  }

  addStep({
    phase: 'no-path',
    currentLine: 0,
    explanation: `No path found from ${startNode} to ${goalNode}.`,
    openSet: [],
    closedSet: [...closedSet],
    current: null,
    highlightedNodes: Object.fromEntries([...closedSet].map((v) => [v, 'visited'])),
    highlightedEdges: [],
    distances: { ...gScore },
    pathEdges: [],
    done: true,
    success: false,
  });

  return steps;
};

export const initialState = ({ graph, startNode, goalNode, positions }) => {
  const steps = generateSteps(graph, startNode, goalNode, positions);
  return {
    graph,
    startNode,
    goalNode,
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
  return state.explanation || 'Initializing A*...';
};

export const getResult = (state) => {
  if (!state.done) return null;
  if (state.success) {
    return {
      success: true,
      title: 'Path Found',
      message: `Shortest path cost: ${state.distances?.[state.goalNode] ?? 0}`,
      details: [
        `Nodes in path: ${state.path?.length || 0}`,
        `Visited nodes: ${state.closedSet?.length || 0}`,
      ],
    };
  }
  return {
    success: false,
    title: 'No Path',
    message: 'A* could not reach the goal.',
    details: [],
  };
};
