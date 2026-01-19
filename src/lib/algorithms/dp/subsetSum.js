// Subset Sum Problem

export const template = {
  name: 'Subset Sum',
  description: 'Determine if any subset sums to target',
  code: [
    { line: 'def subset_sum(nums, target):', indent: 0 },
    { line: 'n = len(nums)', indent: 1 },
    { line: 'dp = [[False] * (target+1) for _ in range(n+1)]', indent: 1 },
    { line: '', indent: 0 },
    { line: 'for i in range(n+1): dp[i][0] = True', indent: 1 },
    { line: '', indent: 0 },
    { line: 'for i in range(1, n+1):', indent: 1 },
    { line: 'for s in range(target+1):', indent: 2 },
    { line: 'if nums[i-1] <= s:', indent: 3 },
    { line: 'dp[i][s] = dp[i-1][s] or dp[i-1][s-nums[i-1]]', indent: 4 },
    { line: 'else:', indent: 3 },
    { line: 'dp[i][s] = dp[i-1][s]', indent: 4 },
    { line: '', indent: 0 },
    { line: 'return dp[n][target]', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(n × target)',
  space: 'O(n × target)',
  bestCase: 'O(n × target)',
  averageCase: 'O(n × target)',
  worstCase: 'O(n × target)',
  note: 'Can be optimized to O(target) space',
};

export function initialState({ nums = [3, 34, 4, 12, 5, 2], target = 9 } = {}) {
  const n = nums.length;

  // Initialize dp table
  const dp = Array(n + 1).fill(null).map(() => Array(target + 1).fill(false));

  // Base case: sum 0 is always achievable (empty subset)
  for (let i = 0; i <= n; i++) dp[i][0] = true;

  return {
    nums: [...nums],
    target,
    n,
    dp,
    i: 1,
    s: 1,
    stepIndex: 0,
    done: false,
    currentLine: 4,
    explanation: 'Initialize: sum=0 is always achievable (empty subset)',
    highlightCell: null,
    includeItem: null,
    phase: 'init',
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { nums, target, n, dp, i, s } = state;

  // Check if we've finished
  if (i > n) {
    // Backtrack to find the subset
    const subset = [];
    let remainingSum = target;
    for (let k = n; k > 0 && remainingSum > 0; k--) {
      if (!dp[k - 1][remainingSum]) {
        subset.unshift(nums[k - 1]);
        remainingSum -= nums[k - 1];
      }
    }

    return {
      ...state,
      done: true,
      currentLine: 13,
      explanation: dp[n][target]
        ? `Found! A subset sums to ${target}`
        : `No subset sums to ${target}`,
      highlightCell: { row: n, col: target },
      result: dp[n][target],
      subset: dp[n][target] ? subset : [],
      phase: 'done',
    };
  }

  const newDp = dp.map(row => [...row]);
  let explanation = '';
  let currentLine = 8;
  let includeItem = null;

  const currentNum = nums[i - 1];

  if (currentNum <= s) {
    // Can either include or exclude this item
    const exclude = dp[i - 1][s];
    const include = dp[i - 1][s - currentNum];
    newDp[i][s] = exclude || include;

    if (include && !exclude) {
      includeItem = true;
      explanation = `nums[${i - 1}]=${currentNum} ≤ ${s}: Include it! dp[${i - 1}][${s - currentNum}]=true`;
    } else if (exclude) {
      includeItem = false;
      explanation = `nums[${i - 1}]=${currentNum} ≤ ${s}: Can achieve without it (dp[${i - 1}][${s}]=true)`;
    } else {
      includeItem = null;
      explanation = `nums[${i - 1}]=${currentNum} ≤ ${s}: Cannot achieve sum ${s} with first ${i} items`;
    }
    currentLine = 9;
  } else {
    // Cannot include this item (too large)
    newDp[i][s] = dp[i - 1][s];
    explanation = `nums[${i - 1}]=${currentNum} > ${s}: Cannot include, copy from above`;
    currentLine = 11;
    includeItem = false;
  }

  // Move to next cell
  let nextI = i;
  let nextS = s + 1;
  if (nextS > target) {
    nextI = i + 1;
    nextS = 1;
  }

  return {
    ...state,
    dp: newDp,
    i: nextI,
    s: nextS,
    stepIndex: state.stepIndex + 1,
    currentLine,
    explanation,
    highlightCell: { row: i, col: s },
    includeItem,
    phase: 'filling',
    lookingAt: currentNum <= s ? [
      { row: i - 1, col: s },
      { row: i - 1, col: s - currentNum },
    ] : [{ row: i - 1, col: s }],
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { nums, target, result, subset } = state;

  if (result) {
    return {
      success: true,
      title: 'Subset Found!',
      message: `Sum ${subset.join(' + ')} = ${target}`,
      details: [
        `Subset: [${subset.join(', ')}]`,
        `Original array: [${nums.join(', ')}]`,
      ],
    };
  }

  return {
    success: false,
    title: 'No Subset Found',
    message: `No subset of [${nums.join(', ')}] sums to ${target}`,
    details: [],
  };
}
