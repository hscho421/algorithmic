export const template = {
  name: 'Union Find',
  description: 'Disjoint Set Union with path compression and union by rank',
  code: [
    { line: 'class UnionFind:', indent: 0 },
    { line: 'init(n):', indent: 1 },
    { line: 'parent[i] = i for all i', indent: 2 },
    { line: 'rank[i] = 0 for all i', indent: 2 },
    { line: '', indent: 0 },
    { line: 'find(x):', indent: 1 },
    { line: 'if parent[x] != x:', indent: 2 },
    { line: 'parent[x] = find(parent[x])', indent: 3 },
    { line: 'return parent[x]', indent: 2 },
    { line: '', indent: 0 },
    { line: 'union(x, y):', indent: 1 },
    { line: 'rootX = find(x)', indent: 2 },
    { line: 'rootY = find(y)', indent: 2 },
    { line: 'if rootX == rootY: return', indent: 2 },
    { line: 'if rank[rootX] < rank[rootY]:', indent: 2 },
    { line: 'parent[rootX] = rootY', indent: 3 },
    { line: 'else if rank[rootX] > rank[rootY]:', indent: 2 },
    { line: 'parent[rootY] = rootX', indent: 3 },
    { line: 'else:', indent: 2 },
    { line: 'parent[rootY] = rootX', indent: 3 },
    { line: 'rank[rootX]++', indent: 3 },
  ],
};

export const complexity = {
  time: 'O(α(n))',
  space: 'O(n)',
  bestCase: 'O(1)',
  averageCase: 'O(α(n))',
  worstCase: 'O(α(n))',
};

export const OPERATION_TYPES = {
  UNION: 'union',
  FIND: 'find',
  CONNECTED: 'connected',
};

const generateSteps = (elements, operations) => {
  const steps = [];
  const parent = {};
  const rank = {};

  elements.forEach((el) => {
    parent[el] = el;
    rank[el] = 0;
  });

  const addStep = (state) => {
    steps.push({
      elements: [...elements],
      parent: { ...parent },
      rank: { ...rank },
      ...state,
    });
  };

  addStep({
    phase: 'init',
    currentLine: 2,
    explanation: `Initialize Union Find with ${elements.length} elements. Each element is its own parent (separate sets).`,
    highlightedNodes: {},
    highlightedEdges: [],
    operationResult: null,
  });

  const find = (x, stepPrefix = '', isSubOperation = false) => {
    const path = [x];
    let current = x;

    // Find root
    while (parent[current] !== current) {
      current = parent[current];
      path.push(current);
    }
    const root = current;

    if (!isSubOperation) {
      addStep({
        phase: 'find-start',
        currentLine: 5,
        explanation: `${stepPrefix}Find(${x}): Starting to find root of ${x}`,
        highlightedNodes: { [x]: 'current' },
        highlightedEdges: [],
        findPath: [x],
        operationResult: null,
      });
    }

    // Show path traversal
    if (path.length > 1) {
      for (let i = 0; i < path.length - 1; i++) {
        addStep({
          phase: 'find-traverse',
          currentLine: 6,
          explanation: `${stepPrefix}Find(${x}): Traverse ${path[i]} → ${path[i + 1]}`,
          highlightedNodes: Object.fromEntries(
            path.slice(0, i + 2).map((p, idx) => [p, idx === i + 1 ? 'current' : 'path'])
          ),
          highlightedEdges: [[path[i], path[i + 1]]],
          findPath: path.slice(0, i + 2),
          operationResult: null,
        });
      }
    }

    addStep({
      phase: 'find-found',
      currentLine: 8,
      explanation: `${stepPrefix}Find(${x}): Found root = ${root}`,
      highlightedNodes: { [root]: 'root', ...Object.fromEntries(path.slice(0, -1).map((p) => [p, 'path'])) },
      highlightedEdges: [],
      findPath: path,
      operationResult: null,
    });

    // Path compression
    if (path.length > 2) {
      addStep({
        phase: 'path-compression-start',
        currentLine: 7,
        explanation: `${stepPrefix}Path compression: Attach all nodes directly to root ${root}`,
        highlightedNodes: { [root]: 'root', ...Object.fromEntries(path.slice(0, -1).map((p) => [p, 'compressing'])) },
        highlightedEdges: [],
        findPath: path,
        operationResult: null,
      });

      for (let i = 0; i < path.length - 1; i++) {
        if (parent[path[i]] !== root) {
          const oldParent = parent[path[i]];
          parent[path[i]] = root;

          addStep({
            phase: 'path-compression',
            currentLine: 7,
            explanation: `${stepPrefix}Path compression: Set parent[${path[i]}] = ${root} (was ${oldParent})`,
            highlightedNodes: { [root]: 'root', [path[i]]: 'compressing' },
            highlightedEdges: [[path[i], root]],
            findPath: path,
            operationResult: null,
          });
        }
      }
    }

    return root;
  };

  const union = (x, y, opIndex) => {
    addStep({
      phase: 'union-start',
      currentLine: 10,
      explanation: `Operation ${opIndex + 1}: Union(${x}, ${y}) — Merge sets containing ${x} and ${y}`,
      highlightedNodes: { [x]: 'operand', [y]: 'operand' },
      highlightedEdges: [],
      operationResult: null,
    });

    const rootX = find(x, `Union(${x},${y}): `, false);
    const rootY = find(y, `Union(${x},${y}): `, false);

    addStep({
      phase: 'union-roots',
      currentLine: 13,
      explanation: `Union(${x}, ${y}): rootX = ${rootX}, rootY = ${rootY}`,
      highlightedNodes: { [rootX]: 'root', [rootY]: 'root' },
      highlightedEdges: [],
      operationResult: null,
    });

    if (rootX === rootY) {
      addStep({
        phase: 'union-same',
        currentLine: 13,
        explanation: `Union(${x}, ${y}): Already in same set! No merge needed.`,
        highlightedNodes: { [rootX]: 'root' },
        highlightedEdges: [],
        operationResult: { type: 'union', x, y, result: false, message: 'Already connected' },
      });
      return false;
    }

    // Union by rank
    if (rank[rootX] < rank[rootY]) {
      addStep({
        phase: 'union-by-rank',
        currentLine: 15,
        explanation: `Union by rank: rank[${rootX}]=${rank[rootX]} < rank[${rootY}]=${rank[rootY]}, attach ${rootX} under ${rootY}`,
        highlightedNodes: { [rootX]: 'merging', [rootY]: 'root' },
        highlightedEdges: [],
        operationResult: null,
      });

      parent[rootX] = rootY;

      addStep({
        phase: 'union-complete',
        currentLine: 15,
        explanation: `Union(${x}, ${y}): Set parent[${rootX}] = ${rootY}. Sets merged!`,
        highlightedNodes: { [rootX]: 'merged', [rootY]: 'root' },
        highlightedEdges: [[rootX, rootY]],
        operationResult: { type: 'union', x, y, result: true, message: `Merged under ${rootY}` },
      });
    } else if (rank[rootX] > rank[rootY]) {
      addStep({
        phase: 'union-by-rank',
        currentLine: 17,
        explanation: `Union by rank: rank[${rootX}]=${rank[rootX]} > rank[${rootY}]=${rank[rootY]}, attach ${rootY} under ${rootX}`,
        highlightedNodes: { [rootX]: 'root', [rootY]: 'merging' },
        highlightedEdges: [],
        operationResult: null,
      });

      parent[rootY] = rootX;

      addStep({
        phase: 'union-complete',
        currentLine: 17,
        explanation: `Union(${x}, ${y}): Set parent[${rootY}] = ${rootX}. Sets merged!`,
        highlightedNodes: { [rootX]: 'root', [rootY]: 'merged' },
        highlightedEdges: [[rootY, rootX]],
        operationResult: { type: 'union', x, y, result: true, message: `Merged under ${rootX}` },
      });
    } else {
      addStep({
        phase: 'union-by-rank',
        currentLine: 19,
        explanation: `Union by rank: rank[${rootX}]=${rank[rootX]} == rank[${rootY}]=${rank[rootY]}, attach ${rootY} under ${rootX} and increment rank`,
        highlightedNodes: { [rootX]: 'root', [rootY]: 'merging' },
        highlightedEdges: [],
        operationResult: null,
      });

      parent[rootY] = rootX;
      rank[rootX]++;

      addStep({
        phase: 'union-complete',
        currentLine: 20,
        explanation: `Union(${x}, ${y}): Set parent[${rootY}] = ${rootX}, rank[${rootX}] = ${rank[rootX]}. Sets merged!`,
        highlightedNodes: { [rootX]: 'root', [rootY]: 'merged' },
        highlightedEdges: [[rootY, rootX]],
        operationResult: { type: 'union', x, y, result: true, message: `Merged under ${rootX}` },
      });
    }

    return true;
  };

  const connected = (x, y, opIndex) => {
    addStep({
      phase: 'connected-start',
      currentLine: 5,
      explanation: `Operation ${opIndex + 1}: Connected(${x}, ${y})? — Check if ${x} and ${y} are in same set`,
      highlightedNodes: { [x]: 'operand', [y]: 'operand' },
      highlightedEdges: [],
      operationResult: null,
    });

    const rootX = find(x, `Connected(${x},${y}): `, false);
    const rootY = find(y, `Connected(${x},${y}): `, false);

    const isConnected = rootX === rootY;

    addStep({
      phase: 'connected-result',
      currentLine: 8,
      explanation: `Connected(${x}, ${y}): rootX=${rootX}, rootY=${rootY} → ${isConnected ? 'YES, same set!' : 'NO, different sets'}`,
      highlightedNodes: { [rootX]: 'root', [rootY]: isConnected ? 'root' : 'root2' },
      highlightedEdges: [],
      operationResult: { type: 'connected', x, y, result: isConnected, message: isConnected ? 'Connected' : 'Not connected' },
    });

    return isConnected;
  };

  const findOnly = (x, opIndex) => {
    addStep({
      phase: 'find-only-start',
      currentLine: 5,
      explanation: `Operation ${opIndex + 1}: Find(${x}) — Find the root/representative of ${x}'s set`,
      highlightedNodes: { [x]: 'operand' },
      highlightedEdges: [],
      operationResult: null,
    });

    const root = find(x, `Find(${x}): `, false);

    addStep({
      phase: 'find-only-result',
      currentLine: 8,
      explanation: `Find(${x}): Root = ${root}`,
      highlightedNodes: { [root]: 'root', [x]: 'found' },
      highlightedEdges: [],
      operationResult: { type: 'find', x, result: root, message: `Root is ${root}` },
    });

    return root;
  };

  // Execute operations
  operations.forEach((op, index) => {
    if (op.type === OPERATION_TYPES.UNION) {
      union(op.x, op.y, index);
    } else if (op.type === OPERATION_TYPES.FIND) {
      findOnly(op.x, index);
    } else if (op.type === OPERATION_TYPES.CONNECTED) {
      connected(op.x, op.y, index);
    }
  });

  // Count components
  const roots = new Set();
  elements.forEach((el) => {
    let current = el;
    while (parent[current] !== current) {
      current = parent[current];
    }
    roots.add(current);
  });

  addStep({
    phase: 'done',
    currentLine: 0,
    explanation: `All operations complete! ${roots.size} disjoint set(s) remain.`,
    highlightedNodes: Object.fromEntries([...roots].map((r) => [r, 'root'])),
    highlightedEdges: [],
    operationResult: null,
    componentCount: roots.size,
    done: true,
  });

  return steps;
};

export const initialState = ({ elements, operations }) => {
  const steps = generateSteps(elements, operations);
  return {
    elements,
    operations,
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
    message: `${state.componentCount} disjoint set(s)`,
    details: `Processed ${state.operations?.length || 0} operations`,
  };
};

export const PRESET_OPERATIONS = {
  simple: {
    name: 'Simple Unions',
    elements: ['A', 'B', 'C', 'D', 'E'],
    operations: [
      { type: OPERATION_TYPES.UNION, x: 'A', y: 'B' },
      { type: OPERATION_TYPES.UNION, x: 'C', y: 'D' },
      { type: OPERATION_TYPES.UNION, x: 'B', y: 'D' },
      { type: OPERATION_TYPES.FIND, x: 'E' },
      { type: OPERATION_TYPES.CONNECTED, x: 'A', y: 'C' },
    ],
  },
  pathCompression: {
    name: 'Path Compression Demo',
    elements: ['1', '2', '3', '4', '5', '6'],
    operations: [
      { type: OPERATION_TYPES.UNION, x: '1', y: '2' },
      { type: OPERATION_TYPES.UNION, x: '2', y: '3' },
      { type: OPERATION_TYPES.UNION, x: '3', y: '4' },
      { type: OPERATION_TYPES.UNION, x: '4', y: '5' },
      { type: OPERATION_TYPES.FIND, x: '5' },
      { type: OPERATION_TYPES.FIND, x: '4' },
    ],
  },
  network: {
    name: 'Social Network',
    elements: ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank'],
    operations: [
      { type: OPERATION_TYPES.UNION, x: 'Alice', y: 'Bob' },
      { type: OPERATION_TYPES.UNION, x: 'Carol', y: 'Dave' },
      { type: OPERATION_TYPES.UNION, x: 'Eve', y: 'Frank' },
      { type: OPERATION_TYPES.CONNECTED, x: 'Alice', y: 'Carol' },
      { type: OPERATION_TYPES.UNION, x: 'Bob', y: 'Carol' },
      { type: OPERATION_TYPES.CONNECTED, x: 'Alice', y: 'Dave' },
    ],
  },
  islands: {
    name: 'Connected Components',
    elements: ['0', '1', '2', '3', '4', '5', '6', '7'],
    operations: [
      { type: OPERATION_TYPES.UNION, x: '0', y: '1' },
      { type: OPERATION_TYPES.UNION, x: '1', y: '2' },
      { type: OPERATION_TYPES.UNION, x: '3', y: '4' },
      { type: OPERATION_TYPES.UNION, x: '5', y: '6' },
      { type: OPERATION_TYPES.UNION, x: '6', y: '7' },
      { type: OPERATION_TYPES.CONNECTED, x: '0', y: '2' },
      { type: OPERATION_TYPES.CONNECTED, x: '3', y: '7' },
      { type: OPERATION_TYPES.UNION, x: '2', y: '5' },
      { type: OPERATION_TYPES.CONNECTED, x: '0', y: '7' },
    ],
  },
};
