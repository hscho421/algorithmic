// Edit Distance (Levenshtein Distance)

export const template = {
  name: 'Edit Distance',
  description: 'Find minimum operations to transform one string to another',
  code: [
    { line: 'def edit_distance(s1, s2):', indent: 0 },
    { line: 'm, n = len(s1), len(s2)', indent: 1 },
    { line: 'dp = [[0] * (n+1) for _ in range(m+1)]', indent: 1 },
    { line: '', indent: 0 },
    { line: 'for i in range(m+1): dp[i][0] = i', indent: 1 },
    { line: 'for j in range(n+1): dp[0][j] = j', indent: 1 },
    { line: '', indent: 0 },
    { line: 'for i in range(1, m+1):', indent: 1 },
    { line: 'for j in range(1, n+1):', indent: 2 },
    { line: 'if s1[i-1] == s2[j-1]:', indent: 3 },
    { line: 'dp[i][j] = dp[i-1][j-1]', indent: 4 },
    { line: 'else:', indent: 3 },
    { line: 'dp[i][j] = 1 + min(', indent: 4 },
    { line: 'dp[i-1][j],    # delete', indent: 5 },
    { line: 'dp[i][j-1],    # insert', indent: 5 },
    { line: 'dp[i-1][j-1]   # replace', indent: 5 },
    { line: ')', indent: 4 },
  ],
};

export const complexity = {
  time: 'O(m × n)',
  space: 'O(m × n)',
  bestCase: 'O(m × n)',
  averageCase: 'O(m × n)',
  worstCase: 'O(m × n)',
  note: 'Can be optimized to O(min(m,n)) space',
};

export function initialState({ s1 = 'kitten', s2 = 'sitting' } = {}) {
  const m = s1.length;
  const n = s2.length;

  // Initialize dp table
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  // Base cases
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  return {
    s1,
    s2,
    m,
    n,
    dp,
    i: 1,
    j: 1,
    stepIndex: 0,
    done: false,
    currentLine: 4,
    explanation: 'Initialize base cases: empty string transformations',
    highlightCell: null,
    operation: null,
    phase: 'init',
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { s1, s2, m, n, dp, i, j } = state;

  // Check if we've finished
  if (i > m) {
    return {
      ...state,
      done: true,
      currentLine: 16,
      explanation: `Done! Edit distance = ${dp[m][n]}`,
      highlightCell: { row: m, col: n },
      result: dp[m][n],
      phase: 'done',
    };
  }

  const newDp = dp.map(row => [...row]);
  let explanation = '';
  let currentLine = 9;
  let operation = null;

  if (s1[i - 1] === s2[j - 1]) {
    newDp[i][j] = dp[i - 1][j - 1];
    explanation = `s1[${i - 1}]='${s1[i - 1]}' == s2[${j - 1}]='${s2[j - 1]}': dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${newDp[i][j]} (no operation)`;
    currentLine = 10;
    operation = 'match';
  } else {
    const deleteCost = dp[i - 1][j] + 1;
    const insertCost = dp[i][j - 1] + 1;
    const replaceCost = dp[i - 1][j - 1] + 1;
    const minCost = Math.min(deleteCost, insertCost, replaceCost);
    newDp[i][j] = minCost;

    if (minCost === replaceCost) {
      operation = 'replace';
      explanation = `s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}': Replace → dp[${i}][${j}] = ${minCost}`;
    } else if (minCost === deleteCost) {
      operation = 'delete';
      explanation = `s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}': Delete → dp[${i}][${j}] = ${minCost}`;
    } else {
      operation = 'insert';
      explanation = `s1[${i - 1}]='${s1[i - 1]}' != s2[${j - 1}]='${s2[j - 1]}': Insert → dp[${i}][${j}] = ${minCost}`;
    }
    currentLine = 12;
  }

  // Move to next cell
  let nextI = i;
  let nextJ = j + 1;
  if (nextJ > n) {
    nextI = i + 1;
    nextJ = 1;
  }

  return {
    ...state,
    dp: newDp,
    i: nextI,
    j: nextJ,
    stepIndex: state.stepIndex + 1,
    currentLine,
    explanation,
    highlightCell: { row: i, col: j },
    operation,
    phase: 'filling',
    comparingCells: [
      { row: i - 1, col: j - 1 },
      { row: i - 1, col: j },
      { row: i, col: j - 1 },
    ],
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { s1, s2, result } = state;

  return {
    success: true,
    title: 'Edit Distance Computed',
    message: `Minimum operations: ${result}`,
    details: [
      `Transform "${s1}" → "${s2}"`,
      `Requires ${result} operation${result !== 1 ? 's' : ''}`,
      'Operations: insert, delete, or replace',
    ],
  };
}
