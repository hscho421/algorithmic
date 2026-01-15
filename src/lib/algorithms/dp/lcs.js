// Longest Common Subsequence (LCS)
// Find the longest subsequence common to two strings

export const TEMPLATES = {
  lcs: {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    description: 'Find longest common subsequence of two strings',
    code: [
      { line: 'function lcs(text1, text2):', indent: 0 },
      { line: 'm = text1.length, n = text2.length', indent: 1 },
      { line: 'dp = 2D array (m+1) × (n+1) filled with 0', indent: 1 },
      { line: '', indent: 0 },
      { line: 'for i = 1 to m:', indent: 1 },
      { line: 'for j = 1 to n:', indent: 2 },
      { line: 'if text1[i-1] == text2[j-1]:', indent: 3 },
      { line: 'dp[i][j] = dp[i-1][j-1] + 1', indent: 4 },
      { line: 'else:', indent: 3 },
      { line: 'dp[i][j] = max(dp[i-1][j], dp[i][j-1])', indent: 4 },
      { line: '', indent: 0 },
      { line: 'return dp[m][n]', indent: 1 },
    ],
  },
};

export const complexity = {
  time: 'O(m × n)',
  space: 'O(m × n)',
  description: 'Build 2D table comparing all characters',
};

export function initialState({ text1 = 'ABCD', text2 = 'ACBD' } = {}) {
  const m = text1.length;
  const n = text2.length;

  // Create dp table with 0-indexed base row and column
  const dp = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  return {
    text1,
    text2,
    m,
    n,
    dp,
    i: 1,
    j: 1,
    stepIndex: 0,
    done: false,
    currentLine: 6,
    result: null,
    explanation: 'Initialized table with base cases (0s)',
    highlightCell: null,
    comparing: [],
    matchFound: false,
    lcsString: null,
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { text1, text2, m, n, dp, i, j } = state;

  if (i > m) {
    // Build LCS string by backtracking
    const lcsString = buildLCS(text1, text2, dp);

    return {
      ...state,
      done: true,
      result: dp[m][n],
      lcsString,
      currentLine: 15,
      explanation: `LCS length: ${dp[m][n]}${lcsString ? `, String: "${lcsString}"` : ''}`,
      highlightCell: [m, n],
    };
  }

  const char1 = text1[i - 1];
  const char2 = text2[j - 1];
  const match = char1 === char2;

  const newDp = dp.map((row) => [...row]);

  if (match) {
    newDp[i][j] = dp[i - 1][j - 1] + 1;

    const nextJ = j + 1;
    const nextI = nextJ > n ? i + 1 : i;
    const finalJ = nextJ > n ? 1 : nextJ;

    return {
      ...state,
      dp: newDp,
      i: nextI,
      j: finalJ,
      stepIndex: state.stepIndex + 1,
      currentLine: 9,
      explanation: `Match! '${char1}' = '${char2}' → dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${newDp[i][j]}`,
      highlightCell: [i, j],
      comparing: [[i - 1, j - 1]],
      matchFound: true,
    };
  }

  // No match - take max of top and left
  const fromTop = dp[i - 1][j];
  const fromLeft = dp[i][j - 1];
  newDp[i][j] = Math.max(fromTop, fromLeft);

  const nextJ = j + 1;
  const nextI = nextJ > n ? i + 1 : i;
  const finalJ = nextJ > n ? 1 : nextJ;

  return {
    ...state,
    dp: newDp,
    i: nextI,
    j: finalJ,
    stepIndex: state.stepIndex + 1,
    currentLine: 11,
    explanation: `'${char1}' ≠ '${char2}' → dp[${i}][${j}] = max(${fromTop}, ${fromLeft}) = ${newDp[i][j]}`,
    highlightCell: [i, j],
    comparing: [
      [i - 1, j],
      [i, j - 1],
    ],
    matchFound: false,
  };
}

function buildLCS(text1, text2, dp) {
  let i = text1.length;
  let j = text2.length;
  const lcs = [];

  while (i > 0 && j > 0) {
    if (text1[i - 1] === text2[j - 1]) {
      lcs.unshift(text1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs.join('');
}

export function getExplanation(state) {
  return state.explanation;
}

export function getResult(state) {
  if (!state.done) return null;

  return {
    success: true,
    title: 'LCS Found',
    message: `Length: ${state.result}`,
    details: [
      `Text 1: "${state.text1}"`,
      `Text 2: "${state.text2}"`,
      state.lcsString ? `LCS: "${state.lcsString}"` : '',
      `Steps taken: ${state.stepIndex}`,
    ].filter(Boolean),
  };
}
