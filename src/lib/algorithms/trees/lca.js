// Lowest Common Ancestor (LCA) using Binary Lifting

export const template = {
  name: 'Lowest Common Ancestor',
  description: 'Find LCA of two nodes using binary lifting',
  code: [
    { line: 'def preprocess(root):', indent: 0 },
    { line: '# Build sparse table for binary lifting', indent: 1 },
    { line: 'for i in range(1, LOG):', indent: 1 },
    { line: 'for v in range(n):', indent: 2 },
    { line: 'if up[v][i-1] != -1:', indent: 3 },
    { line: 'up[v][i] = up[up[v][i-1]][i-1]', indent: 4 },
    { line: '', indent: 0 },
    { line: 'def lca(u, v):', indent: 0 },
    { line: 'if depth[u] < depth[v]: u, v = v, u', indent: 1 },
    { line: '# Lift u to same depth as v', indent: 1 },
    { line: 'diff = depth[u] - depth[v]', indent: 1 },
    { line: 'for i in range(LOG):', indent: 1 },
    { line: 'if (diff >> i) & 1: u = up[u][i]', indent: 2 },
    { line: '# Binary search for LCA', indent: 1 },
    { line: 'if u == v: return u', indent: 1 },
    { line: 'for i in range(LOG-1, -1, -1):', indent: 1 },
    { line: 'if up[u][i] != up[v][i]:', indent: 2 },
    { line: 'u, v = up[u][i], up[v][i]', indent: 3 },
    { line: 'return up[u][0]', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(n log n) preprocess, O(log n) per query',
  space: 'O(n log n)',
  operations: {
    preprocess: 'O(n log n)',
    query: 'O(log n)',
  },
};

function buildTree() {
  // Default tree:
  //        0
  //       /|\
  //      1 2 3
  //     /|   |
  //    4 5   6
  //   /
  //  7
  return {
    nodes: [0, 1, 2, 3, 4, 5, 6, 7],
    parent: [-1, 0, 0, 0, 1, 1, 3, 4],
    children: {
      0: [1, 2, 3],
      1: [4, 5],
      2: [],
      3: [6],
      4: [7],
      5: [],
      6: [],
      7: [],
    },
  };
}

function computeDepths(parent) {
  const n = parent.length;
  const depth = new Array(n).fill(0);
  for (let i = 1; i < n; i++) {
    let d = 0;
    let p = i;
    while (p !== -1) {
      p = parent[p];
      d++;
    }
    depth[i] = d - 1;
  }
  return depth;
}

export function initialState({ tree, queries = [[4, 6], [7, 5], [2, 7]] } = {}) {
  const t = tree || buildTree();
  const depth = computeDepths(t.parent);
  const n = t.nodes.length;
  const LOG = Math.ceil(Math.log2(n)) + 1;
  const edges = t.parent
    .map((p, idx) => (p === -1 ? null : [p, idx]))
    .filter(Boolean);

  // Build sparse table
  const up = Array(n).fill(null).map(() => Array(LOG).fill(-1));
  for (let i = 0; i < n; i++) {
    up[i][0] = t.parent[i];
  }
  for (let j = 1; j < LOG; j++) {
    for (let i = 0; i < n; i++) {
      if (up[i][j - 1] !== -1) {
        up[i][j] = up[up[i][j - 1]][j - 1];
      }
    }
  }

  return {
    tree: t,
    nodes: t.nodes,
    edges,
    depth,
    up,
    LOG,
    queries: [...queries],
    currentQuery: 0,
    stepIndex: 0,
    done: false,
    currentLine: 0,
    explanation: 'Tree preprocessed with binary lifting table',
    phase: 'init',
    u: null,
    v: null,
    highlightedNodes: [],
    highlightedPath: [],
    results: [],
    lca: null,
    depthU: null,
    depthV: null,
    pathU: [],
    pathV: [],
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { tree, depth, up, LOG, queries, currentQuery, results, phase, u, v } = state;

  if (currentQuery >= queries.length) {
    return {
      ...state,
      done: true,
      currentLine: 18,
      explanation: 'All LCA queries complete!',
      phase: 'done',
    };
  }

  const [queryU, queryV] = queries[currentQuery];

  const buildPathToRoot = (node) => {
    const path = [];
    let current = node;
    while (current !== -1 && current != null) {
      path.push(current);
      current = tree.parent[current];
    }
    return path;
  };

  if (phase === 'init' || phase === 'done-query') {
    // Start new query
    let newU = queryU;
    let newV = queryV;
    if (depth[newU] < depth[newV]) {
      [newU, newV] = [newV, newU];
    }

    return {
      ...state,
      u: newU,
      v: newV,
      stepIndex: state.stepIndex + 1,
      currentLine: 8,
      explanation: `Query: LCA(${queryU}, ${queryV}). Ensure u=${newU} is deeper (depth ${depth[newU]}) than v=${newV} (depth ${depth[newV]})`,
      phase: 'lift-to-same-depth',
      highlightedNodes: [newU, newV],
      highlightedPath: [],
      lca: null,
      depthU: depth[newU],
      depthV: depth[newV],
      pathU: buildPathToRoot(newU),
      pathV: buildPathToRoot(newV),
    };
  }

  if (phase === 'lift-to-same-depth') {
    let newU = u;
    const diff = depth[u] - depth[v];

    if (diff > 0) {
      // Lift u
      for (let i = 0; i < LOG; i++) {
        if ((diff >> i) & 1) {
          newU = up[newU][i];
        }
      }

      return {
        ...state,
        u: newU,
        stepIndex: state.stepIndex + 1,
        currentLine: 12,
        explanation: `Lifted u from ${u} to ${newU} (now at same depth ${depth[v]} as v=${v})`,
        phase: 'check-same',
        highlightedNodes: [newU, v],
        depthU: depth[newU],
        depthV: depth[v],
        pathU: buildPathToRoot(newU),
        pathV: buildPathToRoot(v),
      };
    }

    return {
      ...state,
      stepIndex: state.stepIndex + 1,
      currentLine: 14,
      explanation: 'u and v already at same depth',
      phase: 'check-same',
    };
  }

  if (phase === 'check-same') {
    if (u === v) {
      return {
        ...state,
        currentQuery: currentQuery + 1,
        results: [...results, { u: queryU, v: queryV, lca: u }],
        stepIndex: state.stepIndex + 1,
        currentLine: 14,
        explanation: `LCA(${queryU}, ${queryV}) = ${u} (same node!)`,
        phase: 'done-query',
        highlightedNodes: [u],
        lca: u,
      };
    }

    return {
      ...state,
      stepIndex: state.stepIndex + 1,
      currentLine: 15,
      explanation: `u=${u} != v=${v}, binary search for LCA`,
      phase: 'binary-search',
    };
  }

  if (phase === 'binary-search') {
    let newU = u;
    let newV = v;

    for (let i = LOG - 1; i >= 0; i--) {
      if (up[newU][i] !== up[newV][i]) {
        newU = up[newU][i];
        newV = up[newV][i];
      }
    }

    const lca = up[newU][0];

    return {
      ...state,
      u: newU,
      v: newV,
      currentQuery: currentQuery + 1,
      results: [...results, { u: queries[currentQuery][0], v: queries[currentQuery][1], lca }],
      stepIndex: state.stepIndex + 1,
      currentLine: 18,
      explanation: `LCA(${queries[currentQuery][0]}, ${queries[currentQuery][1]}) = ${lca}`,
      phase: 'done-query',
      highlightedNodes: [lca],
      lca,
      depthU: depth[newU],
      depthV: depth[newV],
      pathU: buildPathToRoot(newU),
      pathV: buildPathToRoot(newV),
    };
  }

  return state;
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { results } = state;

  return {
    success: true,
    title: 'LCA Queries Complete',
    message: `Processed ${results.length} queries`,
    details: results.map(r => `LCA(${r.u}, ${r.v}) = ${r.lca}`),
  };
}
