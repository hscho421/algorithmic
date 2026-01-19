// Matrix Chain Multiplication

export const template = {
  name: 'Matrix Chain Multiplication',
  description: 'Find optimal way to multiply chain of matrices',
  code: [
    { line: 'def matrix_chain(dims):', indent: 0 },
    { line: 'n = len(dims) - 1  # number of matrices', indent: 1 },
    { line: 'dp = [[0] * n for _ in range(n)]', indent: 1 },
    { line: '', indent: 0 },
    { line: 'for length in range(2, n+1):', indent: 1 },
    { line: 'for i in range(n - length + 1):', indent: 2 },
    { line: 'j = i + length - 1', indent: 3 },
    { line: 'dp[i][j] = float("inf")', indent: 3 },
    { line: 'for k in range(i, j):', indent: 3 },
    { line: 'cost = dp[i][k] + dp[k+1][j]', indent: 4 },
    { line: 'cost += dims[i] * dims[k+1] * dims[j+1]', indent: 4 },
    { line: 'dp[i][j] = min(dp[i][j], cost)', indent: 4 },
  ],
};

export const complexity = {
  time: 'O(n³)',
  space: 'O(n²)',
  bestCase: 'O(n³)',
  averageCase: 'O(n³)',
  worstCase: 'O(n³)',
};

export function initialState({ dims = [10, 30, 5, 60] } = {}) {
  const n = dims.length - 1; // number of matrices
  const dp = Array(n).fill(null).map(() => Array(n).fill(0));
  const split = Array(n).fill(null).map(() => Array(n).fill(-1));

  // Generate matrix labels
  const matrices = [];
  for (let i = 0; i < n; i++) {
    matrices.push({
      label: `M${i + 1}`,
      rows: dims[i],
      cols: dims[i + 1],
    });
  }

  return {
    dims: [...dims],
    matrices,
    n,
    dp,
    split,
    length: 2,
    i: 0,
    k: 0,
    stepIndex: 0,
    done: false,
    currentLine: 2,
    explanation: `${n} matrices to multiply: ${matrices.map(m => `${m.label}(${m.rows}×${m.cols})`).join(', ')}`,
    highlightCell: null,
    phase: 'init',
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { dims, n, dp, split, length, i, k, matrices } = state;

  // Check if we've finished all lengths
  if (length > n) {
    const optimalOrder = buildParenthesization(split, 0, n - 1, matrices);

    return {
      ...state,
      done: true,
      currentLine: 11,
      explanation: `Done! Minimum cost = ${dp[0][n - 1]}`,
      highlightCell: { row: 0, col: n - 1 },
      result: dp[0][n - 1],
      optimalOrder,
      phase: 'done',
    };
  }

  const j = i + length - 1;

  // Start of new (i, j) pair
  if (k === i) {
    const newDp = dp.map(row => [...row]);
    newDp[i][j] = Infinity;

    return {
      ...state,
      dp: newDp,
      stepIndex: state.stepIndex + 1,
      currentLine: 7,
      explanation: `Computing dp[${i}][${j}]: multiply ${matrices[i].label} to ${matrices[j].label}`,
      highlightCell: { row: i, col: j },
      phase: 'start-pair',
    };
  }

  // Try split at k-1 (we already incremented k)
  const actualK = k - 1;
  const newDp = dp.map(row => [...row]);
  const newSplit = split.map(row => [...row]);

  const cost = dp[i][actualK] + dp[actualK + 1][j] +
    dims[i] * dims[actualK + 1] * dims[j + 1];

  let explanation = '';
  if (cost < newDp[i][j]) {
    newDp[i][j] = cost;
    newSplit[i][j] = actualK;
    explanation = `Split at k=${actualK}: cost = ${dp[i][actualK]} + ${dp[actualK + 1][j]} + ${dims[i]}×${dims[actualK + 1]}×${dims[j + 1]} = ${cost} (new min!)`;
  } else {
    explanation = `Split at k=${actualK}: cost = ${cost} ≥ ${newDp[i][j]} (no update)`;
  }

  // Move to next state
  let nextK = k + 1;
  let nextI = i;
  let nextLength = length;

  if (nextK > j) {
    // Finished this (i, j) pair
    nextI = i + 1;
    nextK = nextI;

    if (nextI > n - length) {
      // Finished this length
      nextLength = length + 1;
      nextI = 0;
      nextK = 0;
    }
  }

  return {
    ...state,
    dp: newDp,
    split: newSplit,
    length: nextLength,
    i: nextI,
    k: nextK,
    stepIndex: state.stepIndex + 1,
    currentLine: 11,
    explanation,
    highlightCell: { row: i, col: j },
    splitAt: actualK,
    phase: 'computing',
    lookingAt: [
      { row: i, col: actualK },
      { row: actualK + 1, col: j },
    ],
  };
}

function buildParenthesization(split, i, j, matrices) {
  if (i === j) {
    return matrices[i].label;
  }
  const k = split[i][j];
  const left = buildParenthesization(split, i, k, matrices);
  const right = buildParenthesization(split, k + 1, j, matrices);
  return `(${left} × ${right})`;
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { matrices, result, optimalOrder } = state;

  return {
    success: true,
    title: 'Optimal Order Found',
    message: `Minimum multiplications: ${result}`,
    details: [
      `Matrices: ${matrices.map(m => `${m.label}(${m.rows}×${m.cols})`).join(', ')}`,
      `Optimal order: ${optimalOrder}`,
    ],
  };
}
