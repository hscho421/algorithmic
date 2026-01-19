// Segment Tree - Range Sum Query with Point Updates

export const template = {
  name: 'Segment Tree',
  description: 'Efficient range queries and point updates',
  code: [
    { line: 'class SegmentTree:', indent: 0 },
    { line: 'def build(self, arr, node, start, end):', indent: 1 },
    { line: 'if start == end:', indent: 2 },
    { line: 'self.tree[node] = arr[start]', indent: 3 },
    { line: 'else:', indent: 2 },
    { line: 'mid = (start + end) // 2', indent: 3 },
    { line: 'build(arr, 2*node, start, mid)', indent: 3 },
    { line: 'build(arr, 2*node+1, mid+1, end)', indent: 3 },
    { line: 'self.tree[node] = tree[2*node] + tree[2*node+1]', indent: 3 },
    { line: '', indent: 0 },
    { line: 'def query(self, node, start, end, l, r):', indent: 1 },
    { line: 'if r < start or end < l: return 0', indent: 2 },
    { line: 'if l <= start and end <= r: return tree[node]', indent: 2 },
    { line: 'mid = (start + end) // 2', indent: 2 },
    { line: 'return query(2*node, start, mid, l, r) +', indent: 2 },
    { line: '       query(2*node+1, mid+1, end, l, r)', indent: 2 },
  ],
};

export const complexity = {
  time: 'O(log n) for query and update',
  space: 'O(n)',
  operations: {
    build: 'O(n)',
    query: 'O(log n)',
    update: 'O(log n)',
  },
};

function buildTree(arr, tree, node, start, end) {
  if (start === end) {
    tree[node] = arr[start];
  } else {
    const mid = Math.floor((start + end) / 2);
    buildTree(arr, tree, 2 * node, start, mid);
    buildTree(arr, tree, 2 * node + 1, mid + 1, end);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
  }
}

export function initialState({ arr = [1, 3, 5, 7, 9, 11], queries = ['sum(1,4)', 'update(2,6)', 'sum(1,4)', 'sum(0,5)'] } = {}) {
  const n = arr.length;
  const tree = new Array(4 * n).fill(0);
  buildTree(arr, tree, 1, 0, n - 1);

  return {
    arr: [...arr],
    tree: [...tree],
    n,
    queries: [...queries],
    currentQuery: 0,
    stepIndex: 0,
    done: false,
    currentLine: 1,
    explanation: `Segment tree built for array [${arr.join(', ')}]`,
    phase: 'init',
    highlightedNodes: [],
    queryResult: null,
    history: [],
  };
}

function parseQuery(q) {
  const sumMatch = q.match(/sum\((\d+),\s*(\d+)\)/);
  if (sumMatch) {
    return { type: 'sum', l: parseInt(sumMatch[1]), r: parseInt(sumMatch[2]) };
  }
  const updateMatch = q.match(/update\((\d+),\s*(\d+)\)/);
  if (updateMatch) {
    return { type: 'update', idx: parseInt(updateMatch[1]), val: parseInt(updateMatch[2]) };
  }
  return { type: 'unknown' };
}

function queryTree(tree, node, start, end, l, r, visited) {
  visited.push(node);
  if (r < start || end < l) return 0;
  if (l <= start && end <= r) return tree[node];
  const mid = Math.floor((start + end) / 2);
  const leftSum = queryTree(tree, 2 * node, start, mid, l, r, visited);
  const rightSum = queryTree(tree, 2 * node + 1, mid + 1, end, l, r, visited);
  return leftSum + rightSum;
}

function updateTree(arr, tree, node, start, end, idx, val, visited) {
  visited.push(node);
  if (start === end) {
    arr[idx] = val;
    tree[node] = val;
  } else {
    const mid = Math.floor((start + end) / 2);
    if (idx <= mid) {
      updateTree(arr, tree, 2 * node, start, mid, idx, val, visited);
    } else {
      updateTree(arr, tree, 2 * node + 1, mid + 1, end, idx, val, visited);
    }
    tree[node] = tree[2 * node] + tree[2 * node + 1];
  }
}

export function executeStep(state) {
  if (state.done) return state;

  const { arr, tree, n, queries, currentQuery, history } = state;

  if (currentQuery >= queries.length) {
    return {
      ...state,
      done: true,
      currentLine: 15,
      explanation: 'All queries complete!',
      phase: 'done',
    };
  }

  const q = queries[currentQuery];
  const parsed = parseQuery(q);
  const newArr = [...arr];
  const newTree = [...tree];
  const newHistory = [...history];
  let explanation = '';
  let currentLine = 10;
  let queryResult = null;
  const visited = [];

  switch (parsed.type) {
    case 'sum': {
      queryResult = queryTree(newTree, 1, 0, n - 1, parsed.l, parsed.r, visited);
      explanation = `sum(${parsed.l}, ${parsed.r}) = ${queryResult}. Visited ${visited.length} nodes.`;
      currentLine = 12;
      newHistory.push({ query: q, result: queryResult, visited: [...visited] });
      break;
    }

    case 'update': {
      const oldVal = newArr[parsed.idx];
      updateTree(newArr, newTree, 1, 0, n - 1, parsed.idx, parsed.val, visited);
      explanation = `update(${parsed.idx}, ${parsed.val}): arr[${parsed.idx}] = ${oldVal} → ${parsed.val}`;
      currentLine = 8;
      newHistory.push({ query: q, oldVal, newVal: parsed.val, visited: [...visited] });
      break;
    }

    default:
      explanation = `Unknown query: ${q}`;
  }

  return {
    ...state,
    arr: newArr,
    tree: newTree,
    currentQuery: currentQuery + 1,
    stepIndex: state.stepIndex + 1,
    currentLine,
    explanation,
    phase: parsed.type,
    highlightedNodes: visited,
    queryResult,
    history: newHistory,
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { arr, history } = state;

  return {
    success: true,
    title: 'Segment Tree Operations Complete',
    message: `Processed ${history.length} queries`,
    details: [
      `Final array: [${arr.join(', ')}]`,
      ...history.map(h => h.result !== undefined ? `${h.query} = ${h.result}` : h.query),
    ],
  };
}
