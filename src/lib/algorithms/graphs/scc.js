export const template = {
  name: 'Strongly Connected Components',
  description: 'Kosaraju algorithm for SCC detection',
  code: [
    { line: 'def kosaraju(graph):', indent: 0 },
    { line: 'visited = set()', indent: 1 },
    { line: 'stack = []', indent: 1 },
    { line: 'for v in vertices:', indent: 1 },
    { line: 'if v not in visited: dfs1(v)', indent: 2 },
    { line: 'transpose = reverse_edges(graph)', indent: 1 },
    { line: 'visited.clear()', indent: 1 },
    { line: 'components = []', indent: 1 },
    { line: 'while stack:', indent: 1 },
    { line: 'v = stack.pop()', indent: 2 },
    { line: 'if v not in visited: components.append(dfs2(v))', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(V + E)',
  space: 'O(V + E)',
  bestCase: 'O(V + E)',
  averageCase: 'O(V + E)',
  worstCase: 'O(V + E)',
};

const buildAdjacency = (graph) => graph.adjacencyList || {};

const transposeGraph = (vertices, edges) => {
  const adjacency = {};
  vertices.forEach((v) => { adjacency[v] = []; });
  edges.forEach(([from, to]) => {
    adjacency[to].push({ node: from, weight: 1 });
  });
  return adjacency;
};

const generateSteps = (graph, positions) => {
  const steps = [];
  const { vertices = [], edges = [] } = graph || {};
  const adjacency = buildAdjacency(graph);
  const transpose = transposeGraph(vertices, edges);
  const visited = new Set();
  const stack = [];
  const components = [];

  const addStep = (state) => {
    steps.push({
      vertices,
      edges,
      positions,
      ...state,
    });
  };

  if (!vertices.length) {
    addStep({
      phase: 'error',
      currentLine: 0,
      explanation: 'No vertices in graph',
      highlightedNodes: {},
      highlightedEdges: [],
      components: [],
      stack: [],
      done: true,
    });
    return steps;
  }

  addStep({
    phase: 'init',
    currentLine: 1,
    explanation: 'Initialize visited set and stack',
    highlightedNodes: {},
    highlightedEdges: [],
    components: [],
    stack: [],
  });

  const dfs1 = (node) => {
    visited.add(node);
    addStep({
      phase: 'dfs1',
      currentLine: 4,
      explanation: `DFS1 visiting ${node}`,
      highlightedNodes: { [node]: 'current' },
      highlightedEdges: [],
      components: [...components],
      stack: [...stack],
    });

    (adjacency[node] || []).forEach(({ node: neighbor }) => {
      if (!visited.has(neighbor)) {
        addStep({
          phase: 'dfs1-edge',
          currentLine: 4,
          explanation: `DFS1 exploring ${node} → ${neighbor}`,
          highlightedNodes: { [node]: 'current', [neighbor]: 'checking' },
          highlightedEdges: [[node, neighbor]],
          components: [...components],
          stack: [...stack],
        });
        dfs1(neighbor);
      }
    });

    stack.push(node);
    addStep({
      phase: 'dfs1-finish',
      currentLine: 4,
      explanation: `DFS1 finished ${node}, push to stack`,
      highlightedNodes: { [node]: 'visited' },
      highlightedEdges: [],
      components: [...components],
      stack: [...stack],
    });
  };

  vertices.forEach((v) => {
    if (!visited.has(v)) {
      dfs1(v);
    }
  });

  addStep({
    phase: 'transpose',
    currentLine: 5,
    explanation: 'Transpose graph and reset visited',
    highlightedNodes: {},
    highlightedEdges: [],
    components: [...components],
    stack: [...stack],
  });

  visited.clear();

  const dfs2 = (node, component) => {
    visited.add(node);
    component.push(node);
    addStep({
      phase: 'dfs2',
      currentLine: 10,
      explanation: `DFS2 visiting ${node} (component ${components.length + 1})`,
      highlightedNodes: { [node]: 'updated' },
      highlightedEdges: [],
      components: [...components, [...component]],
      stack: [...stack],
    });

    (transpose[node] || []).forEach(({ node: neighbor }) => {
      if (!visited.has(neighbor)) {
        addStep({
          phase: 'dfs2-edge',
          currentLine: 10,
          explanation: `DFS2 exploring ${node} → ${neighbor}`,
          highlightedNodes: { [node]: 'updated', [neighbor]: 'checking' },
          highlightedEdges: [[node, neighbor]],
          components: [...components, [...component]],
          stack: [...stack],
        });
        dfs2(neighbor, component);
      }
    });
  };

  while (stack.length) {
    const node = stack.pop();
    if (!visited.has(node)) {
      const component = [];
      dfs2(node, component);
      components.push(component);
      addStep({
        phase: 'component-done',
        currentLine: 10,
        explanation: `Component ${components.length}: {${component.join(', ')}}`,
        highlightedNodes: Object.fromEntries(component.map((n) => [n, 'visited'])),
        highlightedEdges: [],
        components: [...components],
        stack: [...stack],
      });
    }
  }

  addStep({
    phase: 'done',
    currentLine: 10,
    explanation: `Found ${components.length} strongly connected components`,
    highlightedNodes: Object.fromEntries(vertices.map((v) => [v, 'visited'])),
    highlightedEdges: [],
    components: [...components],
    stack: [],
    done: true,
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

export const getExplanation = (state) => state.explanation || 'Initializing...';

export const getResult = (state) => {
  if (!state.done) return null;
  return {
    success: true,
    title: 'SCCs Found',
    message: `Components: ${state.components?.length || 0}`,
    details: (state.components || []).map((c, idx) => `C${idx + 1}: {${c.join(', ')}}`),
  };
};
