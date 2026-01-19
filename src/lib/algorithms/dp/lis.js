// Longest Increasing Subsequence (LIS)

export const template = {
  name: 'Longest Increasing Subsequence',
  description: 'Find the length of longest strictly increasing subsequence',
  code: [
    { line: 'def lis(nums):', indent: 0 },
    { line: 'n = len(nums)', indent: 1 },
    { line: 'dp = [1] * n', indent: 1 },
    { line: '', indent: 0 },
    { line: 'for i in range(1, n):', indent: 1 },
    { line: 'for j in range(i):', indent: 2 },
    { line: 'if nums[j] < nums[i]:', indent: 3 },
    { line: 'dp[i] = max(dp[i], dp[j] + 1)', indent: 4 },
    { line: '', indent: 0 },
    { line: 'return max(dp)', indent: 1 },
  ],
};

export const complexity = {
  time: 'O(n²)',
  space: 'O(n)',
  bestCase: 'O(n²)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
  note: 'Can be optimized to O(n log n) using binary search',
};

export function initialState({ nums = [10, 9, 2, 5, 3, 7, 101, 18] } = {}) {
  const n = nums.length;
  const dp = Array(n).fill(1);

  return {
    nums: [...nums],
    n,
    dp,
    i: 1,
    j: 0,
    stepIndex: 0,
    done: false,
    currentLine: 2,
    explanation: 'Initialize dp array with 1s (each element is a subsequence of length 1)',
    highlightI: null,
    highlightJ: null,
    comparing: false,
    updated: false,
    lisIndices: [],
  };
}

export function executeStep(state) {
  if (state.done) return state;

  const { nums, n, dp, i, j } = state;

  // Check if we've finished
  if (i >= n) {
    // Find the LIS by backtracking
    const maxLen = Math.max(...dp);
    const lisIndices = [];
    let target = maxLen;
    for (let k = n - 1; k >= 0 && target > 0; k--) {
      if (dp[k] === target) {
        if (lisIndices.length === 0 || nums[k] < nums[lisIndices[0]]) {
          lisIndices.unshift(k);
          target--;
        }
      }
    }

    return {
      ...state,
      done: true,
      currentLine: 9,
      explanation: `Done! LIS length = ${maxLen}`,
      highlightI: null,
      highlightJ: null,
      result: maxLen,
      lisIndices,
    };
  }

  // Inner loop
  if (j < i) {
    const comparing = nums[j] < nums[i];

    if (comparing && dp[j] + 1 > dp[i]) {
      const newDp = [...dp];
      newDp[i] = dp[j] + 1;

      return {
        ...state,
        dp: newDp,
        j: j + 1,
        stepIndex: state.stepIndex + 1,
        currentLine: 7,
        explanation: `nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]}, update dp[${i}] = max(${dp[i]}, ${dp[j]}+1) = ${newDp[i]}`,
        highlightI: i,
        highlightJ: j,
        comparing: true,
        updated: true,
      };
    } else {
      return {
        ...state,
        j: j + 1,
        stepIndex: state.stepIndex + 1,
        currentLine: comparing ? 7 : 6,
        explanation: comparing
          ? `nums[${j}]=${nums[j]} < nums[${i}]=${nums[i]}, but dp[${j}]+1=${dp[j] + 1} ≤ dp[${i}]=${dp[i]}, no update`
          : `nums[${j}]=${nums[j]} ≥ nums[${i}]=${nums[i]}, skip`,
        highlightI: i,
        highlightJ: j,
        comparing,
        updated: false,
      };
    }
  }

  // Move to next i
  return {
    ...state,
    i: i + 1,
    j: 0,
    stepIndex: state.stepIndex + 1,
    currentLine: 4,
    explanation: `Move to next element: i = ${i + 1}`,
    highlightI: i + 1,
    highlightJ: null,
    comparing: false,
    updated: false,
  };
}

export function getExplanation(state) {
  return state.explanation || '';
}

export function getResult(state) {
  if (!state.done) return null;

  const { nums, dp, result, lisIndices } = state;
  const lis = lisIndices.map(i => nums[i]);

  return {
    success: true,
    title: 'Longest Increasing Subsequence Found',
    message: `Length: ${result}`,
    details: [
      `One possible LIS: [${lis.join(', ')}]`,
      `dp array: [${dp.join(', ')}]`,
    ],
  };
}
